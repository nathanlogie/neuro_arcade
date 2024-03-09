# --------------------------------------------------------------------
#  This python script is supposed to only work inside a docker image!
#  You will get errors if you run it outside the specific image.
# --------------------------------------------------------------------

import os
import subprocess

VOLUME_PATH = './volume'
EVALUATION_SCRIPT_PATH = VOLUME_PATH + '/evaluation.py'
INPUT_FILE_PATH = VOLUME_PATH + '/input.txt'


def main():
    # checks that the `volume` directory exists:
    if not os.path.exists(VOLUME_PATH):
        print(
            "Docker setup error: directory `volume` not found!\n" +
            " Something is wrong with the docker run command,\n" +
            " make sure it includes the argument `-v ./volume:/usr/src/app/volume/`")
        return 1

    # checks that the evaluation script is present in volume:
    if not os.path.isfile(EVALUATION_SCRIPT_PATH):
        # this will always give you errors if you try to
        # execute it outside the docker container
        print(
            "Docker setup error: evaluation script not found!\n" +
            " This can happen if the evaluation script is not copied properly,\n" +
            " or if it was copied and not renamed into `evaluation.py`.")
        return 2

    # checks that the input file is present:
    if not os.path.isfile(INPUT_FILE_PATH):
        print("Docker setup error: input file not found!\n" +
              " This can happen if the input file is not copied properly,\n" +
              " or if it was copied and not renamed into `input.txt`.")
        return 3

    # This will automatically print the stdout and stderr which will be picked
    # up by the master thread
    output = subprocess.run(
        ['python', EVALUATION_SCRIPT_PATH, INPUT_FILE_PATH], capture_output=True)

    # Pass outputs up to higher layers
    print(output.stdout.decode())
    print(output.stderr.decode())

    # Return return code mapped to our own custom return codes
    return_code = output.returncode

    if return_code == 0:
        # Works fine
        return 0
    elif return_code == 1:
        print("Evaluation script error: script crashed!\n" +
              " Script exited with code 1.")
        return 4
    elif return_code == 2:
        print("Evaluation script error: bad input reported!\n" +
              " Script exited with code 2.")
        return 5
    else:
        # Unexpected return code
        print("Evaluation script error: unexpected return code!\n" +
              f" Script exited with code {return_code}.")
        return 6


if __name__ == '__main__':
    o = main()
    exit(o)
