from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from na.models import Game, GameTag, Player, Score
from na.forms import UserForm


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


def game_add(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Game add page.")


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
            return redirect(reverse('na:index'))
        else:
            error = "Invalid login details."
    else:
        # Setup empty form
        error = None

    context_dict = {
        'error': error,
    }

    return render(request, 'login.html', context=context_dict)

@login_required
def logout(request):
    auth.logout(request)
    return redirect(reverse('na:index'))
