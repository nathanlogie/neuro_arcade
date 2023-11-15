from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from na.models import Game, GameTag, Player, About
from na.forms import UserForm, AboutPageForm


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
    # TODO: Display scores on the game view page
    # scores = game.score_set.all()
    return render(request, 'game_view.html', {'game': game})


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

        # Try find user
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


def about(request):
    about_page = About.objects.first()
    publications = about_page.publications.all()

    context_dict = {'about': about_page, 'publications': publications}

    return render(request, 'about.html', context_dict)


@login_required
def edit_about(request):
    about_page = About.objects.first()

    if request.method =='POST':
        form = AboutPageForm(request.POST, request.FILES, instance=about_page)
        if form.is_valid():
            form.save()
            return redirect('about_page')
    else:
        form = AboutPageForm(instance=about_page)

    return render(request, 'edit_about.html', {'form': form, 'about_page': about_page})