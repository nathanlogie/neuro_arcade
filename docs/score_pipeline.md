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

When unprocessed result data has been received, it's added to a queue. Background
tasks on the site then gradually process this into score data, using the
relevant evaluation scripts.

Evaluation scripts are per-game python scripts uploaded by the owners of games
which take in one set of result data for a game and output one or more numeric
scores for that data. For example, a game's script may calculate the number
of items collected along with the number of inputs used.

Each game also has a score type - these are json files defining what scores for
the game should look like. The scores output from these evaluation scriptss should
fit within the limitations of the score type defined for the game.

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
The scripts communicate with the site's system in two ways: their exit code,
and their prints to stdout/stderr.

### stdout format

Scores should be printed to stdout in json format, as a dictionary mapping
score names to their values. For example,
```json
{
    "Coins": 50,
    "Points": 3.2
}
```

No other text should be printed to stdout on a successful run, otherwise the
results will be unparseable. It is, however, safe to print information in error
cases.

### Exit codes

The evaluation script should exit with code 0 if it successfully ran (python
will do this by default at the end of a normal execution).

If it the script crashes, python will exit with code 1 automatically.

If the script code determines the input result data to be an invalid format,
it should exit with code 2. Ideally, details of why it's invalid should be
printed to stdout or stderr too.

The site does not expect any other exit codes to be used and will treat them
as implementation errors.

See [error handling](#error-handling) for information about what will happen
in error cases.

### Environment

TODO: describe docker image. Are we going to publish it anywhere or just link
our source code?

TODO: are we actually blocking internet access

These scripts will be ran within single-use Docker containers. This means that
any file system modifications will not be retained. The scripts will also not
have access to the internet. The python standard library is available, along with
pandas, numpy and scipy.

Other packages may be made available on request - please get in touch with site
admins.

## Error handling

### Uploader perspective

The uploader of game result data will receive an email if any result data they
upload is not successfully processed. The email will have the unprocessed reuslt
data attached for reference.

If this is due to an error in the evaluation script or site, then they will
only be told it's an internal error and to try again later.

If this is due to their uploaded score being incorrectly formatted, then they
will be informed of this and the email will have any prints made by the
evaluation script to stdout or stderr attached.

### Game owner perspective

The owner of a game which a score was uploaded for will receive an email if
there was an issue with their evaluation script. That is, if their script exits
with code 1 (due to a crash) or with any exit code which wasn't allowed in the
specification above. The email will have the unprocessed result data and contents
of stdout and stderr attached for reference.

### Site admin perspective

The site admin email address will receive a message if an internal error occurs
with the execution of the docker image during processing of a score. The email 
will have the unprocessed result data and contents of stdout and stderr attached
for reference.

Details of all evaluation errors of all types are also logged to the database
for view through the django admin page in the UnprocessedResults table (all
entries with status 2).

## Code structure

All relevant code for this can be found under the `evaluation` folder.

### eval_runner.py

eval_runner is the entrypoint the score pipeline. It should be left running on
the server in the same manner as `manage.py runserver` and similar processes.
This process takes one command line argument, which specifies the number of
evaluation worker threads to use.

The process starts by creating the requested number of evaluation workers and
also creates an email worker thread.

#### Evaluation workers

Each evaluation worker will regularly poll the database to see if any
unprocessed results exist - the interval for this can be configured through the
`POLLING_TIME` constant. If they do, it will attempt to claim one of them
(which may take a few attempts).

If a result is successfully claimed, the thread then sets up a docker
subprocess to run the evaluation script.

The inputs here are a temporary folder mounted to docker with the evaluation
script and input json. The outputs are the return code and prints to stdout
and stderr of the subprocess.

The worker is then responsible for handling the outputs of the subprocess. If
there are errors, it will queue the relevant emails for the email thread to
send. Otherwise, the new scores will be added into the database.

#### Email worker

The email worker thread will take emails from the global `email_list` work
queue and send them, with retrying set up for the various connection errors
and rate limits that can occur in the process. The `RESET_TIME` constant can
be used to configure the interval to wait on an error before retrying.

### Docker image

The docker image consists of a single python script, main.py, which is
responsible for calling the evaluation script in the mounted volume and
relaying its outputs back to the evaluation worker which instantiated this
image.

## Glossary

| Term               | Definition |
|--------------------|------------|
| Unprocessed Result | Raw data, the output of a game |
| Score              | The output of an evaluation script |
| Score Type         | A json format defining the possible score outputs of an evaluation script |
| Evaluation Script  | A game-owner provided python script which converts result data from the game into scores |
