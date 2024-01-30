import os
from typing import Type

from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.forms import BaseFormSet, formset_factory
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.template.defaultfilters import slugify
from django.urls import reverse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import viewsets, status

from na.forms import AboutForm, GameForm, ScoreTypeForm, PublicationFormSet
from na.models import Game, GameTag, Player
from na.forms import UserForm

from django.conf import settings

from serialisers import GameSerializer
import json


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


# TODO maybe you should be logged in for this request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_game(request: Request) -> Response:
    Game.objects.create(
        name=request.data.get('name'),
        slug=slugify(request.data.get('name')),
        description=request.data.get('description'),
        owner=User.objects.get_or_create(
            username="admin123",
            email="admin1234@gmail.com",
            password="adminning"
        ),
        icon=request.data.get('icon'),
        tags=GameTag.objects.get_or_create('tags'),
        score_type=request.data.get('score_type'),
        play_link=request.data.get('playLink'),
        evaluation_script=request.data.get('evaluation_script')
    )


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


@api_view(['POST'])
def sign_up(request: Request) -> Response:
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    # input validation:
    if username is None or email is None or password is None or not validate_password(password):
        return Response(status=400, data='Invalid data.')

    # creating a new User in the DB:
    new_user = User.objects.create_user(username=username, email=email, password=password)

    if new_user is not None:
        return Response(status=200)  # sending a success response back
    else:
        return Response(status=400, data='Error creating new user.')

# -----------------
#   PAGE VIEWS
# -----------------
def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')


def game_search(request: HttpRequest) -> HttpResponse:
    # Process GET parameters
    query = request.GET.get('query')
    wanted_tag_slugs = request.GET.getlist('tags')
    wanted_tags = GameTag.objects.filter(slug__in=wanted_tag_slugs)

    context_dir = {
        'games': get_game_list(query, wanted_tags),
        'tags': GameTag.objects.all()
    }

    return render(request, 'games.html', context_dir)


def game_view(request: HttpRequest, game_name_slug: str) -> HttpResponse:
    return render(request, 'game_view.html', get_game_dict(game_name_slug))


def game_data_add(request: HttpRequest, game_name_slug: str) -> HttpResponse:
    game = get_object_or_404(Game, slug=game_name_slug)
    return HttpResponse("Game data add page for " + game.name + ".")


@login_required
def content_add(request: HttpRequest) -> HttpResponse:
    return render(request, 'add_content.html')


@login_required
def game_add(request: HttpRequest) -> HttpResponse:
    ScoreTypeFormset: Type[BaseFormSet] = formset_factory(ScoreTypeForm, extra=1)

    # Check if submitting or loading
    if request.method == 'POST':
        # Validate submission
        game_form = GameForm(request.POST, request.FILES)
        scoretype_formset = ScoreTypeFormset(request.POST)
        if game_form.is_valid() and scoretype_formset.is_valid():
            # Update database
            game: Game = game_form.save(commit=False)
            game.owner = request.user
            game.score_type["headers"] = scoretype_formset.cleaned_data
            game.save()
            game_form.save_m2m()

            # Send user to the new game's page
            return redirect(reverse('na:game_view', args=[game.slug]))
    else:
        # Setup empty form
        game_form = GameForm()
        scoretype_formset = ScoreTypeFormset()

    context_dict = {
        'game_form': game_form,
        'scoretype_formset': scoretype_formset,
    }

    return render(request, 'add_game.html', context=context_dict)


def player_view(request: HttpRequest, player_name_slug: str) -> HttpResponse:
    player = get_object_or_404(Player, slug=player_name_slug)
    return HttpResponse("Player view page")


@login_required
def model_add(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Model add page")


def deprecated_sign_up(request: HttpRequest) -> HttpResponse:
    # Check not already logged in
    if request.user.is_authenticated:
        return redirect(reverse('na:index'))

    # Check if submitting or loading
    if request.method == 'POST':
        # Validate submission
        user_form = UserForm(request.POST)
        if user_form.is_valid():
            # Update database
            user = user_form.save()
            user.set_password(user.password)
            user.save()

            # Send user to login page
            return redirect(reverse('na:login'))
    else:
        # Setup empty form
        user_form = UserForm()

    context_dict = {
        'user_form': user_form
    }

    return render(request, 'sign_up.html', context=context_dict)


def deprecated_login(request: HttpRequest) -> HttpResponse:
    # Check not already logged in
    if request.user.is_authenticated:
        return redirect(reverse('na:index'))

    # Check if submitting or loading
    if request.method == 'POST':
        # Validate submission
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Try to find user
        user = auth.authenticate(username=username, password=password)
        if user:
            # TODO: check is_active
            auth.login(request, user)

            # Send user to next page if requested, fallback to index
            dest = request.GET.get('next', '')
            if dest == '':
                dest = reverse('na:index')
            return redirect(dest)
        else:
            error = "Invalid login details."
    else:
        # Setup empty form
        error = None

    context_dict = {
        'error': error,
        'submit_url': request.get_full_path(),
    }

    return render(request, 'login.html', context=context_dict)


@login_required
def deprecated_logout(request):
    auth.logout(request)
    return redirect(reverse('na:index'))


def about(request):
    try:
        with open('media/about.json') as f:
            data = json.load(f)
    except FileNotFoundError:  # fallback to a static about.json
        with open('static/about.json') as f:
            data = json.load(f)

    if data['image'] is None or not os.path.exists(data['image']):
        data['image'] = '/static/images/happy-brain.jpg'
    else:
        data['image'] = '/media' + data['image']

    return render(request, 'about.html', data)


@login_required
def edit_about(request):
    context_dict = {"missing_field": False}
    try:
        with open('media/about.json') as f:
            data = json.load(f)
    except FileNotFoundError:  # fallback to a static about.json
        with open('static/about.json') as f:
            data = json.load(f)

    if len(data['publications']) == 0:
        PublicationFormSet.extra = 1
    else:
        PublicationFormSet.extra = 0

    if request.method == 'POST':
        about_form = AboutForm(request.POST, request.FILES,
                               initial={'description': data['description'], 'image': data['image']})
        publication_forms = PublicationFormSet(request.POST, initial=data['publications'])
        if about_form.is_valid():
            # todo: fix the publication form
            description = request.POST.get('description')

            if description:
                data['description'] = description

            if request.FILES.get('image'):
                image = request.FILES['image']

                with default_storage.open('images/' + image.name, 'wb+') as f:
                    for chunk in image.chunks():
                        f.write(chunk)

                data['image'] = 'images/' + image.name

            try:
                data['publications'] = []
                for publication in publication_forms:
                    if publication.is_valid():
                        title = publication.cleaned_data['title']
                        author = publication.cleaned_data['author']
                        link = publication.cleaned_data['link']
                        data['publications'].append({'title': title, 'author': author, 'link': link})
            except KeyError:
                context_dict["missing_field"] = True
                context_dict["aboutForm"] = about_form
                context_dict["publicationForms"] = publication_forms
                return render(request, 'edit_about.html', context_dict)

            with open('media/about.json', 'w') as f:
                json.dump(data, f)

            return redirect(reverse('na:about'))
        else:
            context_dict["aboutForm"] = about_form
            context_dict["publicationForms"] = publication_forms
    else:
        context_dict["aboutForm"] = AboutForm(initial=data)
        context_dict["publicationForms"] = PublicationFormSet(initial=data['publications'])

    return render(request, 'edit_about.html', context_dict)

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def createGame(self,request):
            serializer = GameSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                try:
                    data = serializer.validated_data
                    data['owner'] = User.get_or_create(
                    name="admin123",
                    password="admin1234",
                    email="admin@admin.com")
                    obj = Game.objects.create(**data)
                    return Response(GameSerializer(obj,context = {'request':request}).data)
                except IntegrityError as e:
                    return Response("Game already exists.", status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
