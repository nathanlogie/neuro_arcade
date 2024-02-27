# Score Pipeline Documentation

This file contains documentation of the process of processing game scores and
the components involved in them. It is intended as a reference for both users
and admins of the site.

## Data input

The Neuro Arcade server receives unprocessed result data, which are the outputs
of a game when either a human or an AI model plays it.

Result data must be in json format (one json file per run of a game), but other
than that there are no requirements on how it is structured - it's only read
by the evaluation scripts defined by the owner of the game. For example, a game
could store the inputs a player held on each frame along with the coordinates
of some target objects.

One way that this data can be sent in is through the site's API. This is
generally intended to be used for sending of results as soon as a play of the
game finishes. For example, a game may be hosted for human players on
external website with results immediately being sent to the API on completion.
These results may be anonymous, or may be linked to a player through the site's
authentication system.

Owners of AI models also have the option to batch-upload the unprocessed result
data from their models playing a game through the site's interface.

## Data processing

When unprocessed result data has been received, it's added to a queue. This
queue is periodically processed into score data, using evaluation scripts.

Evaluation scripts are per-game python scripts uploaded by the owners of games
which take in one set of result data for a game and output one or more numeric
scores for that data. For example, a game's script may calculate the number
of items collected along with the number of unneccessary inputs.

These scores should fit within the limitations of the score type defined for
the game.

## Score type format

Score types are defined in a json format. The root level of this format is a
dictionary containing a single key, `headers`, which maps to a list 
dictionaries defining each score category for the game.

Each entry in the header list has 4 possible attributes:
- `name`: Name of this category of score (for example, `Coins`)
- `type`: Data type to store values as, either `int` or `float`
- `min`: Minimum (inclusive) possible value (optional)
- `max`: Maximum (inclusive) possible value (optional)

For example:
```json
{
  "headers": [
    {
      "name": "Coins",
      "type": "int",
      "min": 0,
      "max": 100
    },
    {
      "name": "Points",
      "type": "float",
      "min": 0
    }
  ]
}
```

## Evaluation script format

Evaluation scripts should be python files which take a single argument (path
to the unprocessed result data json file) and print the scores to the console.

### Output format

Scores should be printed in json format, as a dictionary mapping score names
to their values. For example,
```json
{
    "Coins": 50,
    "Points": 3.2
}
```
### Error handling

If the script exits with an error code other than 0, or the output printed
isn't valid (either can't be parsed as json, or doesn't fall within the
constraints of the game's score type), then the score will not be saved. The
error will be logged for game admins to check, along with the unprocessed
result data which triggered it.

TODO - time limit for scripts

### Environment

TODO - this isn't actually confirmed yet

These scripts will be ran within single-use Docker containers (using this image
\- TODO). This means that any file system modifications will not be retained.
The scripts will also not have access to the internet. The python standard
library is available, along with the following 3rd party packages:
```
pandas
numpy
scipy
```
Other packages may be made available on request.

TODO - document python & package versions

## Data display

The scores generated here are what is used to display the tables and charts on the site.

## Glossary

| Term               | Definition |
|--------------------|------------|
| Unprocessed Result | Raw data, the output of a game |
| Score              | The output of an evaluation script |
| Score Type         | A json format defining the possible score outputs of an evaluation script |
| Evaluation Script  | A game-owner provided python script which converts result data from the game into scores |
