import os

from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from na.forms import AboutForm, GameForm, PublicationFormSet
from na.models import Game, GameTag, Player
from na.forms import UserForm
import json


def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')


def game_search(request: HttpRequest) -> HttpResponse:
    # Process GET parameters
    query = request.GET.get('query')
    wanted_tag_slugs = request.GET.getlist('tags')
    wanted_tags = GameTag.objects.filter(slug__in=wanted_tag_slugs)

    context_dir = {
        # Filter games by search parameters
        'games': [
            game for game in Game.objects.all()
            if game.matches_search(query, wanted_tags)
        ],

        # List the tags for selection
        'tags': GameTag.objects.all(),
    }

    return render(request, 'games.html', context_dir)


def game_view(request: HttpRequest, game_name_slug: str) -> HttpResponse:
    game = get_object_or_404(Game, slug=game_name_slug)
    context_dict = {'game': game}
    headers, scores = game.get_score_table()
    if headers is not None and scores is not None:
        context_dict['table_headers'] = headers
        context_dict['rows'] = scores
    return render(request, 'game_view.html', context_dict)


def game_data_add(request: HttpRequest, game_name_slug: str) -> HttpResponse:
    game = get_object_or_404(Game, slug=game_name_slug)
    return HttpResponse("Game data add page.")


@login_required
def game_add(request: HttpRequest) -> HttpResponse:
    # Check if submitting or loading
    if request.method == 'POST':
        # Validate submission
        game_form = GameForm(request.POST)
        if game_form.is_valid():
            # Update database
            game: Game = game_form.save(commit=False)
            game.owner = request.user
            game.icon = request.FILES['icon']
            game.save()
            game_form.save_m2m()

            # Send user to the new game's page
            return redirect(reverse('na:game_view', args=[game.slug]))
    else:
        # Setup empty form
        game_form = GameForm()

    context_dict = {
        'game_form': game_form
    }

    return render(request, 'add_game.html', context=context_dict)


def player_view(request: HttpRequest, player_name_slug: str) -> HttpResponse:
    player = get_object_or_404(Player, slug=player_name_slug)
    return HttpResponse("Player view page")


def model_add(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Model add page")

def sign_up(request: HttpRequest) -> HttpResponse:
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


def login(request: HttpRequest) -> HttpResponse:
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
def logout(request):
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
    context_dict = {}
    try:
        with open('media/about.json') as f:
            data = json.load(f)
    except FileNotFoundError:  # fallback to a static about.json
        with open('static/about.json') as f:
            data = json.load(f)

    if request.method == 'POST':
        about_form = AboutForm(request.POST, request.FILES, initial={'description': data['description'], 'image': data['image']})
        # publication_forms = PublicationFormSet(request.POST, initial=data['publications'])
        if about_form.is_valid():
            # todo: fix the publication form

            # if publication_forms.is_valid():
            #     for p in publication_forms:
            #         title = p.cleaned_data['title']
            #         author = p.cleaned_data['author']
            #         link = p.cleaned_data['link']
            #         data['publications'].append({'title': title, 'author': author, 'link': link})

            description = request.POST.get('description')

            if description:
                data['description'] = description

            with open('media/about.json', 'w') as f:
                json.dump(data, f)

            return redirect(reverse('na:about'))
        else:
            context_dict["aboutForm"] = about_form
            # context_dict["publicationForms"] = publication_forms
    else:
        context_dict["aboutForm"] = AboutForm(initial=data)
        # context_dict["publicationForms"] = PublicationFormSet(initial=data['publications'])

    return render(request, 'edit_about.html', context_dict)
