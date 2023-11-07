from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, render

from na.models import AI, Game, GameTag


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
    scores = game.score_set.all()
    context = {"game": game, 'scores': scores}
    return render(request, 'game_view.html', context)


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


def about(request):
    return HttpResponse("about page")