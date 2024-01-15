from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.test import TestCase
from na.models import Game
# Create your tests here.


class ModelTests(TestCase):
    def createGame(self) -> Game:
        return Game.objects.create(
            name="TestGame",
            description="This is a test description",
            owner=User.objects.create_user(
                username="TestGameOwner",
                password="SuperSecurePassword",
                email="Tester@testing.com"
            ),
            play_link="www.l"
        )

    def test_game(self):
        testGame = self.createGame()
        self.assertTrue(isinstance(testGame, Game))
        self.assertEquals(testGame.slug, slugify(testGame.name))
        self.assertEquals(str(testGame), testGame.name)
        self.assertTrue(isinstance(testGame.owner,User))
        self.assertEquals(testGame.score_type, {"headers": []})

