# MAKE SURE YOU RUN THIS FILE FROM INSIDE /evaluation/ !!!
import sys
import os

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
import django
django.setup()

import subprocess
import time
from threading import Thread
from django.db import transaction
from django.db.utils import OperationalError
from na.models import UnprocessedResults


def main():
    if len(sys.argv) < 2:
        print('Usage: eval_runner.py <number of runner>') 
        return 1

    # Spawn requested number of workers
    num_of_workers = int(sys.argv[1])
    for i in range(num_of_workers):
        t = Thread(target=worker_thread, args=[])
        t.start()

@transaction.atomic
def try_claim_result():
    """Attempts to claim an unprocessed result from the database

    If another process tries accessing the database at the same
    time, this will throw an OperationalError"""

    # Try get first unclaimed score
    result = UnprocessedResults.objects.filter(status=0).first()

    # Back off if no scores exist
    if result is None:
        return None

    # Try claim this score
    # Will throw OperationalError if another process got there first
    result.status = 1
    result.save()
    return result

def worker_thread():
    while True:
        # Try claim a result until not clashing with another process
        try:
            result = try_claim_result()
        except OperationalError:
            continue

        # If no results existed, sleep for a bit and try again
        if result is None:
            time.sleep(5)
            continue

        print(result)


# def main():
#     # todo: shouldn't this script just fetch it's own score?
#     #  or will the dispatcher be a different script
#     if len(sys.argv) < 2:
#         print('Not enough arguments!')  # todo improve this error message
#         return 1

#     # parsing command line arguments:
#     dir_path = BACKLOG_PATH + sys.argv[1] + '/'
#     script_path = dir_path + 'evaluation.py'
#     input_path = dir_path + 'input.txt'

#     # todo move these into volume

#     # run docker_build if necessary
#     # todo figure out how to check if an image already exists
#     #  https://stackoverflow.com/questions/30543409/how-to-check-if-a-docker-image-with-a-specific-tag-exist-locally

#     # run docker_run
#     output = subprocess.run(['sh', 'docker_run.sh'], capture_output=True)

#     print('return code:', output.returncode)
#     print('stdout: ', output.stdout.decode())

#     # todo parse docker_run output and insert it into the DB
#     #  maybe by using the neuro_arcade API?


if __name__ == '__main__':
    main()
