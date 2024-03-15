from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.test import TestCase
from django.urls import reverse

# The ide will shout at you to remove the na from the import but don't
# The na allows it to run in terminal and in the pipeline
from na.models import Game, GameTag, Player, PlayerTag, Score, validate_score, validate_score_header, validate_score_type
import populate

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
        self.assertEqual(testGame.slug, slugify(testGame.name))
        self.assertEqual(str(testGame), testGame.name)
        self.assertTrue(isinstance(testGame.owner, User))
        self.assertEqual(testGame.score_type, {"headers": []})

    def create_gameTag(self) -> GameTag:
        return GameTag.objects.create(
            name="TestGameTag",
            description="WOW this game has tags"
        )

    def test_gameTag(self):
        testTag = self.create_gameTag()
        self.assertTrue(isinstance(testTag, GameTag))
        self.assertEqual(testTag.slug, slugify(testTag.name))
        self.assertEqual(testTag.name, str(testTag))
        self.assertEqual(testTag.name, "TestGameTag")

    def create_playerTag(self) -> PlayerTag:
        return PlayerTag.objects.create(
            name="playerTag",
            description="wow"
        )

    def test_playerTag(self):
        testTag = self.create_playerTag()
        self.assertTrue(isinstance(testTag, PlayerTag))
        self.assertEqual(testTag.name, str(testTag))

    def create_player(self) -> Player:
        return Player.objects.create(
            name="Tester",
            is_ai=True,
            description="Player Bio",
        )

    def test_player(self):
        testPlayer = self.create_player()
        self.assertTrue(isinstance(testPlayer, Player))
        self.assertEqual(testPlayer.slug, slugify(testPlayer.name))
        self.assertEqual(testPlayer.name, str(testPlayer))
        self.assertEqual(bool, type(testPlayer.is_ai))
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
        self.assertEqual(str(testScore), "Tester's score at TestGame")


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


class ScoreHeaderTests(TestCase):
    """Tests for ScoreHeader validation"""

    def test_not_dict(self):
        """Check non-dictionary score headers are rejected"""

        passed, msg = validate_score_header([])

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_extra_key(self):
        """Check score headers with undefined keys are rejected"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "int",
            "extra": None,
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_no_name(self):
        """Check score headers with no name are rejected"""

        passed, msg = validate_score_header({
            "type": "int",
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_non_string_name(self):
        """Check score headers with non-string names are rejected"""

        passed, msg = validate_score_header({
            "name": 1,
            "type": "int",
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_no_type(self):
        """Check score headers with non-string names are rejected"""

        passed, msg = validate_score_header({
            "name": "Name",
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_type_not_valid(self):
        """Check score headers with invalid types are rejected"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "bad",
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_min_type_not_valid(self):
        """Check score headers with invalid type values for min are rejected"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "int",
            "min": 1.0,
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_max_type_not_valid(self):
        """Check score headers with invalid type values for min are rejected"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "int",
            "max": 1.0,
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_min_greater_than_max(self):
        """Check score headers with min >= max are rejected"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "float",
            "min": 1.0,
            "max": 0.0,
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_valid_float(self):
        """Check valid float score headers are accepted"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "float",
            "min": 0.0,
            "max": 1.0,
        })

        self.assertIsNone(msg)
        self.assertTrue(passed)

    def test_valid_int(self):
        """Check valid int score headers are accepted"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "int",
            "min": 0,
            "max": 1,
        })

        self.assertIsNone(msg)
        self.assertTrue(passed)

    def test_valid_no_min(self):
        """Check valid score headers without minimums are accepted"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "int",
            "max": 1,
        })

        self.assertIsNone(msg)
        self.assertTrue(passed)

    def test_valid_no_max(self):
        """Check valid score headers without maximums are accepted"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "int",
            "min": 0,
        })

        self.assertIsNone(msg)
        self.assertTrue(passed)

    def test_valid_no_min_max(self):
        """Check valid score headers without minimums or maximums are accepted"""

        passed, msg = validate_score_header({
            "name": "Name",
            "type": "int",
        })

        self.assertIsNone(msg)
        self.assertTrue(passed)


class ScoreTypeTests(TestCase):
    """Tests for ScoreType validation"""

    def test_not_dict(self):
        """Check non-dictionary score types are rejected"""

        passed, msg = validate_score_type([])

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_no_headers(self):
        """Check score types without headers are rejected"""

        passed, msg = validate_score_type({})

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_extra_key(self):
        """Check score types with undefined keys are rejected"""

        passed, msg = validate_score_type({
            "headers": [],
            "extra": None,
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_headers_not_list(self):
        """Check score types with non-list headers are rejected"""

        passed, msg = validate_score_type({
            "headers": None,
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_header_not_valid(self):
        """Check score types with invalid headers are rejected"""

        passed, msg = validate_score_type({
            "headers": [7],
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_second_header_not_valid(self):
        """Check score types with a mix of valid and invalid headers are rejected"""

        passed, msg = validate_score_type({
            "headers": [
                {
                    "name": "Name",
                    "type": "int",
                },
                7
            ],
        })

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_valid(self):
        """Check valid score types are accepted"""

        passed, msg = validate_score_type({
            "headers": [
                {
                    "name": "Name",
                    "type": "int",
                },
            ],
        })

        self.assertIsNone(msg)
        self.assertTrue(passed)


class ScoreTests(TestCase):
    """Tests for Score validation"""

    score_type = {
        "headers": [
            {
                "name": "Name",
                "type": "int",
                "min": 0,
                "max": 10,
            }
        ]
    }

    def test_not_dict(self):
        """Check non-dictionary scores are rejected"""

        passed, msg = validate_score(self.score_type, [])

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_extra_key(self):
        """Check scores with invalid fields are rejected"""

        passed, msg = validate_score(
            self.score_type,
            {
                "Name": 5,
                "extra": 1,
            },
        )

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_missing_key(self):
        """Check scores with missing fields are rejected"""

        passed, msg = validate_score(
            self.score_type,
            {
            },
        )

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_past_min(self):
        """Check scores with values past their minimum are rejected"""

        passed, msg = validate_score(
            self.score_type,
            {
                "Name": -1,
            },
        )

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_past_max(self):
        """Check scores with values past their maximum are rejected"""

        passed, msg = validate_score(
            self.score_type,
            {
                "Name": 11,
            },
        )

        self.assertIsNotNone(msg)
        self.assertFalse(passed)

    def test_valid(self):
        """Check valid scores are accepted"""

        passed, msg = validate_score(
            self.score_type,
            {
                "Name": 5,
            },
        )

        self.assertIsNone(msg)
        self.assertTrue(passed)

    def test_valid_no_min(self):
        """Check valid scores with no minimum are accepted"""

        passed, msg = validate_score(
            {
                "headers": [
                    {
                        "name": "Name",
                        "type": "int",
                        "max": 10,
                    }
                ]
            },
            {
                "Name": -10,
            },
        )

        self.assertIsNone(msg)
        self.assertTrue(passed)

    def test_valid_no_max(self):
        """Check valid scores with no maximum are accepted"""

        passed, msg = validate_score(
            {
                "headers": [
                    {
                        "name": "Name",
                        "type": "int",
                        "min": 0,
                    }
                ]
            },
            {
                "Name": 20,
            },
        )

        self.assertIsNone(msg)
        self.assertTrue(passed)
