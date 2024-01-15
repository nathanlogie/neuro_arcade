from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.test import TestCase

# The ide will shout at you to remove the na from the import but don't
# The na allows it to run in terminal and in the pipeline
from na.models import Game, GameTag, PlayerTag, Player, Score


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
        self.assertTrue(isinstance(testGame.owner, User))
        self.assertEquals(testGame.score_type, {"headers": []})

    def create_gameTag(self) -> GameTag:
        return GameTag.objects.create(
            name="TestGameTag",
            description="WOW this game has tags"
        )

    def test_gameTag(self):
        testTag = self.create_gameTag()
        self.assertTrue(isinstance(testTag, GameTag))
        self.assertEquals(testTag.slug, slugify(testTag.name))
        self.assertEquals(testTag.name, str(testTag))
        self.assertEquals(testTag.name, "TestGameTag")

    def create_playerTag(self) -> PlayerTag:
        return PlayerTag.objects.create(
            name="playerTag",
            description="wow"
        )

    def test_playerTag(self):
        testTag = self.create_playerTag()
        self.assertTrue(isinstance(testTag, PlayerTag))
        self.assertEquals(testTag.name, str(testTag))

    def create_player(self) -> Player:
        return Player.objects.create(
            name="Tester",
            is_ai=True,
            description="Player Bio",
        )

    def test_player(self):
        testPlayer = self.create_player()
        self.assertTrue(isinstance(testPlayer, Player))
        self.assertEquals(testPlayer.slug, slugify(testPlayer.name))
        self.assertEquals(testPlayer.name, str(testPlayer))
        self.assertEquals(bool, type(testPlayer.is_ai))
        self.assertIsNone(testPlayer.user)

    def create_score(self) -> Score:
        return Score.objects.create(
            player=self.create_player(),
            game=self.create_game()
        )

    def test_score(self):
        testScore = self.create_score()
        self.assertIsInstance(testScore, Score)
        self.assertIsInstance(testScore.player, Player)
        self.assertIsInstance(testScore.game, Game)
        self.assertEquals(str(testScore), "Tester's score at TestGame")
