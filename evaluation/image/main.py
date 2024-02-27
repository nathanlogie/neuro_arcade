# --------------------------------------------------------------------
#  This python script is supposed to only work inside a docker image!
#  You will get errors if you run it outside the specific image.
# --------------------------------------------------------------------

import os

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
    try:
        from volume import evaluation
        # TODO: also check that evaluation has an evaluation function inside
        #  should be `def evaluation(inp: str) -> str:`
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

    with open('volume/input.txt', 'r') as f:
        data = f.read()

    # todo: rather than running an arbitrary function, maybe run it as main?
    #  the example file in /neuro_arcade/static/population/evaluation_functions/example.py
    #  starts executing outside a function (inside an if __name__==`__main__`)
    output = evaluation.evaluation(data)

    print(output)

    return 0


if __name__ == '__main__':
    main()
