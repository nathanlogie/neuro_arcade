from collections import defaultdict
import os

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.middleware.csrf import get_token

from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from na.models import PlayerTag
from django.conf import settings

from na.serialisers import GameSerializer, UserSerializer, GameTagSerializer, PlayerSerializer, PlayerTagSerializer
import json
from na.models import Game, GameTag, Player, UserStatus, Score


# ------------------
#  HELPER FUNCTIONS
# ------------------
def get_game_dict(game_slug: str):
    """
    Gets the data associated with a game.

    :param game_slug: string representing the game slug
    """
    game = get_object_or_404(Game, slug=game_slug)
    dictionary = {'game': GameSerializer(game).data}
    headers, scores = game.get_score_table()
    if headers is not None and scores is not None:
        dictionary['table_headers'] = headers
        dictionary['rows'] = scores
    return dictionary


def get_game_list(query, wanted_tags=None, num=None):
    """
    Gets a list of games.

    :param query: Search Query
    :param wanted_tags: List of tags that the returned games will have
    :param num: Number of games to return
    """
    if wanted_tags is None:
        wanted_tags = []
    games = [
        game for game in Game.objects.all()
        if game.matches_search(query, wanted_tags)
    ]
    # taking only the first N games
    if num is not None:
        games = games[:num]
    return games


def validate_password(password):
    # TODO improve password validation
    return len(password) >= 8


def get_player_dict(player_slug: str):
    """
    Gets the data associated with a player.

    :param player_slug: string representing the player slug
    """
    player = get_object_or_404(Player, slug=player_slug)
    dictionary = {
        'name': player.name,
        'is_ai': player.is_ai,
        'user': player.user.username if player.user else None,
        'description': player.description,
        'tags': [tag.name for tag in player.tags.all()] if player.tags else [],
    }
    return dictionary


# ----------------
#    API CALLS
# ----------------
@api_view(['GET', 'POST'])
def ping(request: Request) -> Response:
    """
    Ping! Always responds with a 200 OK.
    """
    return Response(status=200)


@api_view(['GET'])
def csrf(request: Request) -> Response:
    """
    Sends a CSRF token.
    """
    return Response({'csrfToken': get_token(request)})


@api_view(['GET'])
def get_game(request: Request, game_name_slug: str) -> Response:
    """
    Retrieve Game Information
    """
    game = get_game_dict(game_name_slug)
    return Response(game)


@api_view(['GET'])
def get_tags(request: Request) -> Response:
    """
    Retrieves the GameTags
    """

    return Response([GameTagSerializer(tag).data for tag in GameTag.objects.all()])


@api_view(['GET'])
def get_games_sorted(request: Request) -> Response:
    # Process GET parameters
    query = request.GET.get('query')
    wanted_tag_slugs = request.GET.getlist('tags')
    wanted_tags = GameTag.objects.filter(slug__in=wanted_tag_slugs)
    num = request.GET.get('num')
    if num is not None:
        num = int(num)

    game_list = get_game_list(query, wanted_tags, num)
    return Response([GameSerializer(game).data for game in game_list])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_game_score(request: Request, game_name_slug: str) -> Response:
    """
    Post Score for a game. The format for the body of the Post request is as follows:

    For every score type header, the request needs to have a field called the same as the score header.
    Additionally, the request needs to specify the player responsible for the score by including either
    the id ('PlayerID') or name ('PlayerName') of the player. Keep in mind that the player needs to be
    associated with the current authenticated user, or the request will be refused.

    Example: for a score type with a single header called 'Points' then the request needs to have
    a field called 'Points' and a field either called 'PlayerID' or 'PlayerName'.
    """

    # checking that the Post request contains a player field
    # either 'PlayerID' or 'PlayerName'
    playerID = request.data.get('PlayerID', None)
    playerName = request.data.get('PlayerName', None)
    if playerID is not None:
        player = Player.objects.get(id=playerID, user=request.user)
    elif playerName is not None:
        player = Player.objects.get(name=playerName, user=request.user)
    else:
        return Response(status=400, data={
            'description': 'No player field provided, or provided player is not associated with this your user.'
        })

    game = get_object_or_404(Game, slug=game_name_slug)
    added_score = {}
    # for score type header in game
    for header in game.score_type['headers']:
        score = request.data.get(header['name'])
        if score is not None:
            # Score has been found, now it has to be checked if it's valid.
            value = float(score)
            # Checking that it is above the min:
            if header['min'] is not None and value < header['min']:
                msg = 'Score field ' + header['name'] + ' is invalid: value is bellow the allowed minimum.'
                return Response(status=400, data={'description': msg})
            # Checking that it is below the max:
            if header['max'] is not None and value > header['max']:
                msg = 'Score field ' + header['name'] + ' is invalid: value is above the allowed maximum.'
                return Response(status=400, data={'description': msg})

            # TODO use validation script here

            # Value is valid, so it will be added to the database
            added_score[header['name']] = score
        else:
            return Response(status=400, data={'description': 'Score field ' + header['name'] + ' not present'})

    if len(added_score.keys()) == 0:
        return Response(status=400, data={'description': 'No relevant score fields were provided.'})

    game.score_set.create(
        player_id=player.id,
        game_id=game.id,
        score=added_score
    )

    return Response(status=200)


@api_view(['GET'])
def get_about_data(request: Request) -> Response:
    """
    Posts about data from json file
    Posts from media/about.json
    Uses static/about.json as a fallback
    """

    file = 'about.json'
    try:
        with open(os.path.join(settings.MEDIA_ROOT, file), "r") as f:
            about = json.load(f)

    except FileNotFoundError:
        with open(os.path.join(settings.STATICFILES_DIRS[0], file), "r") as f:
            about = json.load(f)

    return Response(about)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def post_about_data(request) -> Response:
    """
    Retrieves About data from edit about form and posts it to media/about.json
    Gets a field and value. Depending on the field, it handles the data appropriately
    """
    file = 'about.json'
    media_file_path = os.path.join(settings.MEDIA_ROOT, file)
    try:
        with open(media_file_path, "r") as f:
            about = json.load(f)

    except FileNotFoundError:
        with open(os.path.join(settings.STATICFILES_DIRS[0], file), "r") as f:
            about = json.load(f)

    try:  # todo don't have this entire function in a try block

        field = request.data.get('field')
        value = request.data.get('value')

        if not field:
            return Response(status=400)

        if field == "description":
            about["description"] = value
        elif field == "publications":
            about["publications"] = []

            for p in value:
                about["publications"].append(
                    {
                        'title': p['title'],
                        'author': p['author'],
                        'link': p['link']
                    }
                )

        with open(media_file_path, 'w') as f:
            json.dump(about, f)

        return Response(status=200)
    except Exception as e:
        print("ERROR OCCURRED: ", e)
        return Response(status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_new_player(request: Request) -> Response:
    """
    Requests the creation of a new player.
    The request should be of format: {playerName: str, isAI: bool}
    """
    # TODO add support for PlayerTags
    user = request.user
    player_name = request.data.get('playerName')
    is_AI = request.data.get('isAI')
    if player_name is None or is_AI is None:
        return Response(status=400, data='Invalid data; `playerName` and `isAI` must be provided!')

    try:
        player, was_created = Player.objects.get_or_create(name=player_name, is_ai=is_AI, user=user)
    except IntegrityError:
        # Actually, it's the player slug that needs to be unique.
        return Response(status=400, data='Invalid data; Player name must be unique!')

    if was_created:
        return Response(status=201, data={
            'msg': 'Player was successfully created!',
            'playerID': player.id
        })
    else:
        return Response(status=200, data={
            'msg': 'Player already exists!',
            'playerID': player.id,
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_player(request: Request) -> Response:
    """
    Requests the deletion of a player associated with the current user.
    The request should be of format: {playerName: str}
    """
    user = request.user
    player_name = request.data.get('playerName')
    if player_name is None:
        return Response(status=400, data='Invalid data; `playerName` must be provided!')

    try:
        player = Player.objects.get(name=player_name, user=user)
    except ObjectDoesNotExist:
        return Response(status=404, data='Player not found!')

    if not player.is_ai:
        return Response(status=400, data='Request Refused; Only AI players (AI Models) can be deleted!')

    player.delete()
    return Response(status=200, data='Player successfully deleted!')


@api_view(['POST'])
def login(request: Request) -> Response:
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    user = None
    if username is not None:
        # login with username
        user = authenticate(username=username, password=password)
    if username is None and email is not None:
        # login with email
        # Note that the authenticate function does not work with email.
        # get a user associated with the email
        maybe_user = User.objects.get(email=email)
        if maybe_user is not None:
            # check the password
            if maybe_user.check_password(password):
                # email and password are good, set user
                user = maybe_user
    if user is None:
        return Response(status=403, data="Wrong credentials provided.")

    token = Token.objects.get_or_create(user=user)[0]
    response_data = {
        'username': user.username,
        'email': user.email,
        'is_admin': user.is_superuser,
        'token': token.key,
        'status': None,
    }
    if not user.is_superuser:
        response_data['status'] = user.status.status

    return Response(status=200, data=response_data)


@api_view(['POST'])
def sign_up(request: Request) -> Response:
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    # input validation:
    if username == "" or email == "" or password == "":
        return Response(status=400, data='Missing Fields.')

    if not validate_password(password):
        return Response(status=400, data='Invalid Password. Password must be at least 8 characters.')

    if User.objects.filter(username=username).exists():
        return Response(status=409, data='Username already taken.')

    if User.objects.filter(email=email).exists():
        return Response(status=409, data='Email already taken.')

    # creating a new User in the DB:
    new_user = User.objects.create_user(username=username, email=email, password=password)
    status = UserStatus.objects.create(user=new_user)

    if new_user is None:
        return Response(status=500, data='Error creating new user.')

    # creating a human player associated with the User:
    Player.objects.create(  # Todo: can this fail? If it can, handle the error.
        name=username,
        is_ai=False,
        user=new_user,
        description=("Human player of " + username + ".")
    )

    return Response(status=200)


@api_view(['POST'])
def update_user_status(request: Request) -> Response:

    if not request.data['user'] or not request.data['status']:
        return Response(status=400, data='Missing data in request')

    user = User.objects.get(username=request.data['user'])
    newStatus = request.data['status']

    status = UserStatus.objects.get(user=user)
    status.status = newStatus

    status.save()

    if status.status == newStatus:
        return Response(status=200)
    else:
        return Response(status=500, data='Error while trying to update user status')


@api_view(['GET'])
def get_model_rankings(request: Request) -> Response:
    """
    Gets the overall rankings of AI models

    Format is a list of score, player pairs in descending order of score

    This is based on their relative performances across tasks.
    Every task a model has a score in gives them a score from 0-100 based on the percentile
    they fall in on the leaderboard, considering highest scores only.
    Coming first in the leaderboard gives 100 points, decreasing by (100 / n) each position after.
    These are then summed up to give their overall score.

    This function definitely needs optimising in the future, probably running the calculations
    automatically at an interval and caching the results. The logic could also use some splitting.
    The API should remain stable, so the current implementation is enough for frontend development
    to begin.
    """

    player_ranks = defaultdict(lambda: 0.0)

    for game in Game.objects.all():
        # Get the leaderboards for this game
        try:
            rank_tables = game.get_highest_scores()
        except Exception as e:
            # The database may currently contain some games with invalid leaderboards
            # TODO: remove once validation & population updated
            continue

        # Distribute scores for each leaderboard
        for ranking in rank_tables.values():
            # Filter out humans
            ai_ranking = [score for score in ranking if score.player.is_ai]

            # Ignore empty leaderboards
            if len(ai_ranking) == 0:
                continue

            # Calculate the decrease in score for each position
            step = 100 / len(ai_ranking)

            # Give out the points for each position
            for i, score in enumerate(ai_ranking):
                player_ranks[score.player.id] += 100.0 - (i * step)

    # Build response data structure
    data = [
        {
            'player': PlayerSerializer(player, context={'request': request}).data,
            'overall_score': player_ranks[player.id],
        }
        for player in Player.objects.all()
        if player.is_ai
    ]
    data.sort(key=lambda d: -d['overall_score'])

    return Response(status=200, data=data)

@api_view(['GET'])
def get_player(request: Request, player_name_slug: str) -> Response:
    """
    Retrieve Player Information
    """
    player = get_player_dict(player_name_slug)
    return Response(player)


@api_view(['GET'])
def get_player_scores(request: Request, player_name_slug: str) -> Response:
    """
    Retrieve all scores made by players
    """
    try:
        player = Player.objects.get(slug=player_name_slug)
        print("YAY")
    except Player.DoesNotExist:
        print("BOO")
        return Response(status=400)
    
    scores = Score.objects.filter(player=player)

    scores_data = []
    for score in scores:
        score_data = {
            'game_name': score.game.name,
            'value': score.score
        }
        scores_data.append(score_data)


    return Response(scores_data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameTagViewSet(viewsets.ModelViewSet):
    queryset = GameTag.objects.all()
    serializer_class = GameTagSerializer


class PlayerTagViewSet(viewsets.ModelViewSet):
    queryset = PlayerTag.objects.all()
    serializer_class = PlayerTagSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
