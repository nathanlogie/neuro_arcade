import json
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist

from na.serialisers import GameSerializer, UserSerializer, GameTagSerializer
from rest_framework import viewsets
from rest_framework.authtoken import views as rest_views
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from na.models import Game, GameTag, Player


# ------------------
#  HELPER FUNCTIONS
# ------------------
def get_game_dict(game_slug: str):
    """
    Gets the data associated with a game.

    :param game_slug: string representing the game slug
    """
    game = get_object_or_404(Game, slug=game_slug)
    dictionary = {'game': game.serialize()}
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


# ----------------
#    API CALLS
# ----------------
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
    return Response([tag.serialize() for tag in GameTag.objects.all()])


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

    return Response([game.serialize() for game in game_list])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def post_game_score(request: Request, game_name_slug: str) -> Response:
    """
    Post Score for a game. The format for the body of the Post request is as follows:

    For every score type header, the request needs to have a field called the same as the score header.
    Additionally, the request needs to specify the id of the player responsible for the score.

    Example: for a score type with a single header called 'Points' that has an int value,
    the request needs to look like: {'played':<player.id>, 'Points': <value>}
    """
    # todo: this needs to be changed for the new authentication
    # checking that the Post request contains the player field
    if request.user.get('player') is None:
        return Response(status=400, data={'description': 'No player field was provided.'})

    game = get_object_or_404(Game, slug=game_name_slug)
    player = get_object_or_404(Player, id=request.data.get('player'))
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
def post_about_data(request) -> Response:

    """
    Retrieves About data from edit about form and posts it to media/about.json
    Gets a field and value. Depending on the field, it handles the data appropriately
    """

    file_path = os.path.join(settings.MEDIA_ROOT, 'about.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        field = request.data.get('field')
        value = request.data.get('value')

        if not field:
            return Response(status=400)

        if field == "description":
            data["description"] = value
        elif field == "publications":
            data["publications"] = []

            for p in value:
                data["publications"].append(
                    {
                        'title': p['title'],
                        'author': p['author'],
                        'link': p['link']
                    }
                )

        with open(file_path, 'w') as f:
            json.dump(data, f)

        return Response(status=200)
    except Exception as e:
        print("ERROR OCCURRED: ", e)
        return Response(status=400)


@permission_classes([IsAuthenticated])
@csrf_exempt
def post_new_player(request: Request) -> Response:
    """
    Requests the creation of a new player.
    The request should be of format: {playerName: str, isAI: bool}
    """
    # TODO add support for PlayerTags
    print(request.data)
    user = request.user
    player_name = request.data['playerName']
    is_AI = request.data['isAI']
    if player_name is None or is_AI is None:
        return Response(status=400, data='Invalid data; `playerName` and `isAI` must be provided!')

    player, was_created = Player.objects.get_or_create(name=player_name, is_ai=is_AI, user=user)
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
@csrf_exempt
def delete_player(request: Request) -> Response:
    """
    Requests the deletion of a player associated with the current user.
    The request should be of format: {playerName: str}
    """
    user = request.user
    player_name = request.data['playerName']
    if player_name is None:
        return Response(status=400, data='Invalid data; `playerName` must be provided!')

    try:
        player = Player.objects.get(name=player_name, user=user)
    except ObjectDoesNotExist:
        return Response(status=404, data='Player not found!')

    player.delete()
    return Response(status=200, data='Player successfully deleted!')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def post_game(request: Request) -> Response:
    # get the user with:
    # user = request.user
    pass


@csrf_exempt  # TODO THIS IS UNSECURE; DO REMOVE
def login(request: HttpRequest) -> Response:
    if request.method == 'POST':
        response = rest_views.obtain_auth_token(request)

        # sending back if the user is admin or not
        user_id = Token.objects.get(key=response.data['token']).user_id
        user = User.objects.get(id=user_id)
        response.data['is_admin'] = user.is_superuser

        return response


@api_view(['POST'])
def sign_up(request: Request) -> Response:
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    # input validation:
    if username is None or email is None or password is None or not validate_password(password):
        return Response(status=400, data='Invalid data.')

    if User.objects.filter(username=username).exists():
        return Response(status=409, data='Username already taken.')

    if User.objects.filter(email=email).exists():
        return Response(status=409, data='Email already taken.')

    # creating a new User in the DB:
    new_user = User.objects.create_user(username=username, email=email, password=password)

    if new_user is not None:
        return Response(status=200)  # sending a success response back
    else:
        return Response(status=400, data='Error creating new user.')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class GameTagViewSet(viewsets.ModelViewSet):
    queryset = GameTag.objects.all()
    serializer_class = GameTagSerializer
