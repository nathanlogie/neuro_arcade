# MAKE SURE YOU RUN THIS FILE FROM INSIDE /evaluation/ !!!

import os
import sys
import subprocess

BACKLOG_PATH = './backlog/'

def main():
    # todo: shouldn't this script just fetch it's own score?
    #  or will the dispatcher be a different script
    if len(sys.argv) < 2:
        print('Not enough arguments!')  # todo improve this error message
        return 1

    # parsing command line arguments:
    dir_path = BACKLOG_PATH + sys.argv[1] + '/'
    script_path = dir_path + 'evaluation.py'
    input_path = dir_path + 'input.txt'

    # todo move these into volume

    # run docker_build if necessary
    # todo figure out how to check if an image already exists
    #  https://stackoverflow.com/questions/30543409/how-to-check-if-a-docker-image-with-a-specific-tag-exist-locally

    # run docker_run
    output = subprocess.run(['sh', 'docker_run.sh'], capture_output=True)

    print('return code:', output.returncode)
    print('stdout: ', output.stdout.decode())

    # todo parse docker_run output and insert it into the DB
    #  maybe by using the neuro_arcade API?


if __name__ == '__main__':
    # todo: check that this is run inside the evaluation dir!!
    #  paths won't work outside of it

    # print(os.getcwd())
    # print(__file__)
    # print(os.path.basename(__file__))
    # print(os.path.dirname(__file__))
    main()
