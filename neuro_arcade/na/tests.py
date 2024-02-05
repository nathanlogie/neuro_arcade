from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.test import TestCase
from django.urls import reverse

# The ide will shout at you to remove the na from the import but don't
# The na allows it to run in terminal and in the pipeline
from na.models import Game, GameTag, PlayerTag, Player, Score
import populate
import na.forms
from na.forms import UserForm, GameForm
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


class PopulationScriptTests(TestCase):

    def test_Added(self):
        populate.populate()

        games = Game.objects.all()
        gametags = GameTag.objects.all()
        players = Player.objects.all()
        playertags = PlayerTag.objects.all()

        self.assertTrue(len(games) > 1)
        self.assertTrue(len(gametags) > 1)
        self.assertTrue(len(players) > 1)
        self.assertTrue(len(playertags) > 1)


class FormTests(TestCase):
    def test_register(self):
        self.assertTrue('UserForm' in dir(na.forms))
        form = UserForm()
        self.assertEqual(type(form.__dict__['instance']), User)

    def test_add_game(self):
        self.assertTrue('GameForm' in dir(na.forms))
        form = GameForm()
        self.assertEqual(type(form.__dict__['instance']), Game)

class ViewTests(TestCase):

    model = ModelTests()

    def test_index(self):
        url = reverse("na:index")
        resp = self.client.get(url)
        self.assertEquals(resp.status_code, 200)

    def test_loggedin_index(self):
        url = reverse("na:index")
        self.client.force_login(user=User.objects.create())
        resp = self.client.get(url)
        self.assertEquals(resp.status_code, 200)

    def test_game_add(self):
        url = reverse("na:game_add")
        self.client.logout()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

