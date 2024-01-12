from na.models import Game

# TODO Ideally don't do manual serialisation

def serialize_game(game: Game):
    d = {
        'name': str(game.name),
        'slug': str(game.slug),
        'description': str(game.description),
        # TODO make this give you a web URL, instead of a local filepath
        # 'icon': str(game.icon.path),
        'tags': [tag.name for tag in game.tags.all()],
        'score_type': game.score_type,
        'play_link': str(game.play_link),
    }
    # TODO serialise evaluation script and game owner fields

    # if game.evaluation_script is not None:
    #     d['evaluation_script'] = str(game.evaluation_script.path)
    # else:
    #     d['evaluation_script'] = 'None'
    # 'owner': str(game.owner)

    return d
