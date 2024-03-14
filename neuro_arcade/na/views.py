from collections import defaultdict
import os

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.middleware.csrf import get_token

from rest_framework import viewsets, status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from na.models import PlayerTag, validate_score_type
from django.conf import settings

from na.serialisers import GameSerializer, UserSerializer, GameTagSerializer, PlayerSerializer, PlayerTagSerializer
from na.models import Game, GameTag, Player, UserStatus, PlayerTag, UnprocessedResults, Score

import json
from na.models import Game, GameTag, Player, UserStatus


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

    # scores:
    headers, scores = game.get_score_table()
    if headers is not None and scores is not None:
        dictionary['table_headers'] = headers
        dictionary['rows'] = scores

    # replacing the game tags ids with the tag names
    tag_ids = dictionary['game']['tags']
    tag_names = []
    for tag_id in tag_ids:
        tag = GameTag.objects.get(id=tag_id)
        tag_names.append(tag.name)
    dictionary['game']['tags'] = tag_names

    # adding the owner name field:
    owner_id = dictionary['game']['owner']
    owner_obj = User.objects.get(id=owner_id)
    dictionary['game']['owner'] = {
        'name': owner_obj.username,
        'id': owner_id
    }

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
    return Response(
        [GameTagSerializer(tag).data for tag in GameTag.objects.all()]
    )


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
                msg = 'Score field ' + \
                    header['name'] + ' is invalid: value is bellow the allowed minimum.'
                return Response(status=400, data={'description': msg})
            # Checking that it is below the max:
            if header['max'] is not None and value > header['max']:
                msg = 'Score field ' + \
                    header['name'] + ' is invalid: value is above the allowed maximum.'
                return Response(status=400, data={'description': msg})

            # Value is valid, so it will be added to the database
            added_score[header['name']] = score
        else:
            return Response(
                status=400, data={
                    'description': 'Score field ' + header['name'] + ' not present'})

    if len(added_score.keys()) == 0:
        return Response(
            status=400, data={
                'description': 'No relevant score fields were provided.'})

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
    The request should be of format: {playerName: str, description: str, playerTags: [str]}
    """
    player_name = request.data.get('playerName')
    description = request.data.get('description')
    player_tags = request.data.get('playerTags')
    icon = request.data.get('icon')

    if player_name is None:
        return Response(status=400, data='Invalid data; `playerName` must be provided!')
    if description is None:
        return Response(status=400, data='Invalid data; `description` must be provided!')
    if player_tags is not None:
        player_tags = player_tags.split(',')

    player_obj, _ = Player.objects.get_or_create(
        name=player_name,
        description=description,
        is_ai=True,
        icon=icon,
        user=request.user
    )

    # adding player tags to the new player
    tags_to_add = []
    for tag in player_tags:
        # Note: this can create new tags
        selected_tag = PlayerTag.objects.get_or_create(name=tag)[0]
        tags_to_add.append(selected_tag)
    player_obj.tags.set(tags_to_add)

    # successful outcome
    return Response(status=201, data={
        'msg': 'Player was successfully created!',
        'playerID': player_obj.id
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_new_game(request: Request) -> Response:
    """
    Requests the creation of a new game.
    The request should be of format:
    {
        gameName: str,
        description: str,
        playLink: str,           //optional
        icon: Image,             //optional
        evaluationScript: str,
        scoreTypes: str,
        gameTags: [str]
    }
    """
    game_name = request.data.get('gameName')
    description = request.data.get('description')
    play_link = request.data.get('playLink')
    icon = request.data.get('icon')
    evaluation_script = request.data.get('evaluationScript')
    score_types = request.data.get('scoreTypes')
    game_tags = request.data.get('gameTags')

    if game_name is None:
        return Response(status=400, data='Invalid data; `gameName` must be provided!')
    if description is None:
        return Response(status=400, data='Invalid data; `description` must be provided!')
    if play_link is None:
        return Response(status=400, data='Invalid data; `playLink` must be provided!')
    if evaluation_script is None:
        return Response(status=400, data='Invalid data; `evaluationScript` must be provided!')
    if score_types is None:
        return Response(status=400, data='Invalid data; `scoreTypes` must be provided!')
    if game_tags is not None:
        game_tags = game_tags.split(',')

    # validating the score_type
    score_types = json.load(score_types)
    valid_score_type, score_type_error = validate_score_type(score_types)
    if not valid_score_type:
        return Response(status=400, data='Invalid data; `scoreTypes` is not valid: ' + score_type_error)

    game_obj, _ = Game.objects.get_or_create(
        name=game_name,
        owner=request.user,
        description=description,
        play_link=play_link,
        icon=icon,
        evaluation_script=evaluation_script,
        score_type=score_types
    )

    # adding game tags to the new game
    tags_to_add = []
    for tag in game_tags:
        # Note: this can create new tags
        selected_tag = GameTag.objects.get_or_create(name=tag)[0]
        tags_to_add.append(selected_tag)
    game_obj.tags.set(tags_to_add)

    return Response(status=200, data={
        'msg': 'Game was successfully created!',
        'playerID': game_obj.id
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_game(request: Request) -> Response:
    """
    Requests the deletion of a game associated with the current user.
    The request should be of format: {gameName: str}
    """
    game_name = request.data.get('gameName')
    if game_name is None:
        return Response(status=400, data='Invalid data; `gameName` must be provided!')

    try:
        game = Game.objects.get(name=game_name)
    except ObjectDoesNotExist:
        return Response(status=404, data='Game not found!')

    if game.owner != request.user and not request.user.is_superuser:
        return Response(status=400, data='Request Refused; This game is not owned by you!')

    game.delete()
    return Response(status=200, data='Game successfully deleted!')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_player(request: Request) -> Response:
    """
    Requests the deletion of a player associated with the current user.
    The request should be of format: {playerName: str}
    """
    player_name = request.data.get('playerName')
    if player_name is None:
        return Response(status=400, data='Invalid data; `playerName` must be provided!')

    try:
        player = Player.objects.get(name=player_name)
    except ObjectDoesNotExist:
        return Response(status=404, data='Player not found!')

    if player.user != request.user and not request.user.is_superuser:
        return Response(status=400, data='Request Refused; This player is not owned by you!')

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
        'id': user.id,
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
        return Response(
            status=400,
            data='Invalid Password. Password must be at least 8 characters.')

    if User.objects.filter(username=username).exists():
        return Response(status=409, data='Username already taken.')

    if User.objects.filter(email=email).exists():
        return Response(status=409, data='Email already taken.')

    # creating a new User in the DB:
    new_user = User.objects.create_user(
        username=username, email=email, password=password)
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
@permission_classes([IsAdminUser])
def update_user_status(request: Request) -> Response:
    """
    Changes the approval status of a user. The request should be formatted like so:
    {'user': <username>, 'status': <'pending' or 'approved' or 'blocked'>}
    """
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
        return Response(
            status=500,
            data='Error while trying to update user status')


@api_view(['GET'])
def get_player_rankings(request: Request) -> Response:
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
            # Ignore empty leaderboards
            if len(ranking) == 0:
                continue

            # Calculate the decrease in score for each position
            step = 100 / len(ranking)

            # Give out the points for each position
            for i, score in enumerate(ranking):
                player_ranks[score.player.id] += 100.0 - (i * step)

    # Build response data structure
    data = [
        {
            'player': PlayerSerializer(player, context={'request': request}).data,
            'overall_score': player_ranks[player.id],
            'is_AI': player_ranks[player.is_ai]
        }
        for player in Player.objects.all()
    ]
    data.sort(key=lambda d: -d['overall_score'])

    return Response(status=200, data=data)


@api_view(['GET'])
def get_player(request: Request, player_name_slug: str) -> Response:
    """
    Retrieve Player Information
    """
    player = get_object_or_404(Player, slug=player_name_slug)
    player_data = PlayerSerializer(player).data

    tag_names = [tag.name for tag in player.tags.all()]

    username = player.user.username

    player_data['tags'] = tag_names
    player_data['user'] = username
    return Response(player_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_human_player_for_logged_in_user(request: Request) -> Response:
    try:
        player_obj = Player.objects.get(user=request.user, is_ai=False)
    except ObjectDoesNotExist:
        return Response(status=404, data='Human user does not exist!')
    data = PlayerSerializer(player_obj).data
    return Response(status=200, data=data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_players_for_logged_in_user(request: Request) -> Response:
    player_objs = Player.objects.filter(user=request.user)
    data = []
    for player_obj in player_objs:
        data.append(PlayerSerializer(player_obj).data)
    return Response(status=200, data=data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_games_for_logged_in_user(request: Request) -> Response:
    game_objs = Game.objects.filter(owner=request.user)
    data = []
    for game_obj in game_objs:
        data.append(GameSerializer(game_obj).data)
    return Response(status=200, data=data)


@api_view(['GET'])
def get_player_scores(request: Request, player_name_slug: str) -> Response:
    """
    Retrieve all scores made by a player.
    """
    player = get_object_or_404(Player, slug=player_name_slug)

    scores = Score.objects.filter(player=player)

    scores_data = []
    for score in scores:
        score_data = {
            'game_name': score.game.name,
            'value': score.score
        }
        scores_data.append(score_data)

    return Response(scores_data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def post_admin_ranking(request) -> Response:
    """
    Posts admin ranking for a game, which is represented by the stars shown on the website.
    The request should be formatted like so:
    {'id': <game id>, 'ranking': <number> }
    The ranking number needs to be between 0 and 10.
    """
    game = get_object_or_404(Game, id=request.data["id"])
    ranking = request.data.get("ranking")

    if ranking is None:
        return Response(
            status=400,
            data="Error occurred while trying to retrieve ranking")

    game.priority = request.data["ranking"]
    game.save()

    return Response(status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_unprocessed_result(request: Request) -> Response:
    """
    Upload of raw score that will need to be evaluated. User needs to be authenticated.
    Request format: {
        game: <game slug>,
        player: <player slug>,
        content: <raw score, as string>,
    }
    Player field needs to be owned by the user making the request
    """
    # getting the fields from the request
    game = request.data.get('game')
    player = request.data.get('player')
    content = request.data.get('content')
    # making sure the fields are present
    if game is None:
        return Response(status=400, data='Field \'game\' not provided!')
    if player is None:
        return Response(
            status=400,
            data='Field \'player\' not provided! ' +
            'Note: AI models are considered players for this request.')
    if content is None:
        return Response(status=400, data='Field \'content\' not provided!')
    # getting the game object
    try:
        game_obj = Game.objects.get(slug=game)
    except ObjectDoesNotExist:
        # game slug is incorrect; throwing an error
        return Response(
            status=400,
            data='Provided game does not exist! Make sure you are passing the Game\'s name slug.')
    # getting the player object
    try:
        player_obj = Player.objects.get(name=player)
    except ObjectDoesNotExist:
        # player slug is incorrect; throwing an error
        return Response(
            status=400,
            data='Provided player/model does not exist! Make sure you are passing the Player\'s name.')
    # checking that the player is owned by the authenticated user
    if player_obj.user != request.user:
        return Response(
            status=400,
            data='Provided player/model is not owned by the authenticated user! ' +
            'You can not upload scores attributed to a Player/Model that\'s not associated with the user')
    # finally, creating the raw score object
    new_raw_score = UnprocessedResults.objects.create(
        game=game_obj, player=player_obj, content=content)
    # checking the raw score was actually created
    if new_raw_score is None:
        return Response(
            status=500,
            data='Internal error encountered while trying to upload a raw score to the database!' +
            'Please contact an admin.')
    # request fully successful, returning OK 200
    return Response(
        status=200,
        data='Raw Score has successfully been added to the queue.')


@api_view(['GET'])
def get_user_players(request: Request, user_id: int) -> Response:
    """
    Gets all players owned by a user

    Args:
        request: request sent
        user_id: id of the user

    Returns:
        Response with all player models owned by that user
    """
    players = Player.objects.filter(user=user_id)

    user_players = []
    for player in players:
        user_players.append(PlayerSerializer(player).data)

    return Response(user_players)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_game(request: Request, game_name_slug: str) -> Response:
    """
    PATCH request to update game data

    Args:
        request: containing user and data to change to
        game_name_slug: slug of the game

    Returns:
        Response:
            with status 200 on success;
            with status 401 if current logged-in user doesn't match game owner;
            with status 404 if game not found;
            with status 400 otherwise
    """

    game_obj = get_object_or_404(Game, slug=game_name_slug)
    if game_obj.owner != request.user and not request.user.is_superuser:
        return Response(status=401)

    serializer = GameSerializer(game_obj, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(status=400, data=serializer.errors)
    serializer.save()

    # adding tags
    if request.data.get('gameTags') is not None:
        tags_to_add = []
        game_obj.tags.set([])
        for tag in request.data.get('gameTags').split(','):
            # Note: this can create new tags
            selected_tag = GameTag.objects.get_or_create(name=tag)[0]
            tags_to_add.append(selected_tag)
        game_obj.tags.set(tags_to_add)

    return Response(status=200, data=serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_player(request, player_name_slug) -> Response:
    """
    PATCH request to update player data

    Args:
        request: containing user and data to change to
        player_name_slug: slug of the player

    Returns:
        Response:
            with status 200 on success;
            with status 401 if current logged-in user doesn't match player user;
            with status 404 if player not found;
            with status 400 otherwise
    """

    player_obj = get_object_or_404(Player, slug=player_name_slug)
    if player_obj.user != request.user and not request.user.is_superuser:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    serializer = PlayerSerializer(player_obj, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(status=400, data=serializer.errors)
    serializer.save()

    # adding tags
    if request.data.get('playerTags') is not None:
        tags_to_add = []
        player_obj.tags.set([])
        for tag in request.data.get('playerTags').split(','):
            # Note: this can create new tags
            selected_tag = PlayerTag.objects.get_or_create(name=tag)[0]
            tags_to_add.append(selected_tag)
        player_obj.tags.set(tags_to_add)

    return Response(status=200, data=serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request) -> Response:
    """
    Returns a list of all users. Admin only.
    """
    if not request.user.is_superuser:
        return Response(status=401)

    users = User.objects.all()
    users_serialised = UserSerializer(users, many=True).data

    return Response(status=200, data=users_serialised)


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['POST'])
    def add_tags(self, request, pk=None):
        data = request.data
        game = self.get_object()
        if not game:
            return Response(status=status.HTTP_404_NOT_FOUND)

        game.tags.clear()

        tags = data['tags'].split(',')
        for tag in tags:
            game.tags.add(GameTag.objects.get(id=tag))

        game.save()
        return Response("Tags added", status=200)


class GameTagViewSet(viewsets.ModelViewSet):
    queryset = GameTag.objects.all()
    serializer_class = GameTagSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PlayerTagViewSet(viewsets.ModelViewSet):
    queryset = PlayerTag.objects.all()
    serializer_class = PlayerTagSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def add_tags(self, request, pk=None):
        data = request.data
        player = self.get_object()
        if not player:
            return Response(status=status.HTTP_404_NOT_FOUND)

        player.tags.clear()
        tags = data['tags'].split(',')
        for tag in tags:
            player.tags.add(PlayerTag.objects.get(id=tag))

        player.save()
        return Response("Tags added", status=200)
