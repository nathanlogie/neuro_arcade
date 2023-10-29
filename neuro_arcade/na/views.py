from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, render

from na.models import AI, Game, GameTag


def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')


def game_search(request: HttpRequest) -> HttpResponse:
    context_dir = {
        'games': Game.objects.all(),
        'tags': GameTag.objects.all(),
    }

    return render(request, 'games.html', context_dir)


def game_view(request: HttpRequest, game_name_slug: str) -> HttpResponse:
    game = get_object_or_404(Game, slug=game_name_slug)
    return render(request, 'game_view.html', {"game_name": game.name})


def game_data_add(request: HttpRequest, game_name_slug: str) -> HttpResponse:
    game = get_object_or_404(Game, slug=game_name_slug)
    return HttpResponse("Game data add page.")


def game_add(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Game add page.")


def model_view(request: HttpRequest, model_name_slug: str) -> HttpResponse:
    model = get_object_or_404(AI, slug=model_name_slug)
    return HttpResponse("Model view page")


def model_add(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Model add page")
