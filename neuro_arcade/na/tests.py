from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.test import TestCase
from models import Game, GameTag
# Create your tests here.


class ModelTests(TestCase):
    def create_game(self) -> Game:
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
        testGame = self.create_game()
        self.assertTrue(isinstance(testGame, Game))
        self.assertEquals(testGame.slug, slugify(testGame.name))
        self.assertEquals(str(testGame), testGame.name)
        self.assertTrue(isinstance(testGame.owner,User))
        self.assertEquals(testGame.score_type, {"headers": []})

    def create_gameTag(self):
        return GameTag.objects.create(
            name="TestGameTag",
            description="WOW this game has tags"
        )

    def test_gameTag(self):
        testTag = self.create_gameTag()
        self.assertTrue(isinstance(testTag,GameTag))
        self.assertEquals(testTag.slug, slugify(testTag.name))
        self.assertEquals(testTag.name, str(testTag))
        self.assertEquals(testTag.name, "TestGameTag")
