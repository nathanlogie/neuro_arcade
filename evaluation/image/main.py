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
        print("Error #1: directory `volume` not found!\n" +
              " Something is wrong with the docker run command,\n" +
              " make sure it includes the argument `-v ./volume:/usr/src/app/volume/`")
        return 1

    # checks that the evaluation script is present in volume:
    # PLACEHOLDER
    try:
        from volume import evaluation
        # TODO this should run evaluation, rather it should just run the full file
    except ImportError:
        # this will always give you errors if you try to
        # execute it outside the docker container
        print("Error #2: evaluation script not found!\n" +
              " This can happen if the evaluation script is not copied properly,\n" +
              " or if it was copied and not renamed into `evaluation.py`.")
        return 2

    # checks that the input file is present:
    if not os.path.isfile(INPUT_FILE_PATH):
        print("Error #3: input file not found!\n" +
              " This can happen if the input file is not copied properly,\n" +
              " or if it was copied and not renamed into `input.txt`.")
        return 3

    output = subprocess.run(['python', 'volume/evaluation.py', 'volume/input.txt'], capture_output=True)
    print(output.returncode)
    print('stdout: ', output.stdout.decode())

    # no issue encountered, returning 0
    return 0


if __name__ == '__main__':
    o = main()
    exit(o)
