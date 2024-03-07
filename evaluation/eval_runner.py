# MAKE SURE YOU RUN THIS FILE FROM INSIDE /evaluation/ !!!
import sys
import os

from django.conf import settings
from django.core.mail import EmailMessage

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
import django
django.setup()

import shutil
import subprocess
from tempfile import TemporaryDirectory
from threading import Thread
import time

from django.db import transaction
from django.db.utils import OperationalError

from na.models import UnprocessedResults


# Time to wait in seconds before polling again if there were no scores
# available the last time
POLLING_TIME = 1

def main():
    if len(sys.argv) < 2:
        print('Usage: eval_runner.py <number of runner>') 
        return 1

    # Build docker image first
    subprocess.run(["docker", "build", "-t", "evaluation-container", "./image"])

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

    # Try to get first unclaimed score
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
            time.sleep(POLLING_TIME)
            continue

        # Run the image, mounted with a temporary directory for the input files
        with TemporaryDirectory() as temp_dir:
            eval_file = os.path.join(temp_dir, 'evaluation.py')
            input_file = os.path.join(temp_dir, 'input.txt')
            shutil.copyfile(result.game.evaluation_script.path, eval_file)
            with open(input_file,"w") as f:
                f.write(result.content)

            proc = subprocess.run(
                [
                    "docker", "run", "-it", "--rm",
                    "-v", f"{temp_dir}:/usr/src/app/volume/",
                    "evaluation-container",
                ],
                capture_output=True,
            )

        # Combine output streams
        output = proc.stdout.decode() + '\n' + proc.stderr.decode()

        # print("Subprocess exit:", proc.returncode, proc.stdout, proc.stderr)
        print("Exit code", proc.returncode)

        # Handle errors
        if proc.returncode == 0:#
            # TODO: save score

            # Delete unneeded result data
            result.delete()
        else:
            # Log to database
            result.status = 2
            result.errors = output
            result.save()

            # Email required users
            email_handler(proc.returncode, output, result)

def build_message(name: str, result: UnprocessedResults, details: str) -> str:
    return (
        f"Hi {name} \n\n"
    
        f"The following attempted upload of game results has failed: \n\n"
    
        f"Upload: results for {result.player.user.username} in {result.game.name} at "
        f"{result.upload_date.strftime('%Y-%m-%d %H-%M-%S')}\n"
        f"{details}\n\n"
        
        "Team @ NeuroArcade"
    )
def admin_notification(return_code: int, stdout: str, result: UnprocessedResults):
    recipient = [settings.ADMIN_EMAIL]
    email_from = settings.EMAIL_HOST_USER
    subject = f"ADMIN NOTIFICATION: Docker Failure in {result.game.name}"
    message = ""
    if return_code not in [1, 2, 3]:
        return
    elif return_code == 1:
        message = build_message(
            "Admin",
            result,
            (
                f"Upload: {result} \n"
                f"Error Code: {return_code} - The volume folder could not be found (Issue with docker run command) \n\n"
                "Please see attached for full error log and uploaded data"
            )
        )
    elif return_code == 2:
        message = build_message(
            "Admin",
            result,
            (
                f"Upload: {result} \n"
                f"Error Code: {return_code} - The evaluation script could not be found \n\n"
                "Please see attached for full error log and uploaded data"
            )
        )
    elif return_code == 3:
        message = build_message(
            "Admin",
            result,
            (
                f"Upload: {result} \n"
                f"Error Code: {return_code} - The input data could not be found \n\n"
                "Please see attached for full error log and uploaded data"
            )
        )

    email = EmailMessage(
        subject,
        message,
        email_from,
        recipient,
        attachments=[
            ("Console Log.txt", stdout, "text/plain"),
            ("uploaded_data.json", result.content, "application/json")
        ]
    )
    email.send()

def owner_notification(return_code: int, stdout: str, result: UnprocessedResults):
    recipient = [result.game.owner.email]
    email_from = settings.EMAIL_HOST_USER
    subject = f"GAME NOTIFICATION: Score Processing Failure in {result.game.name}"
    message = ""
    if return_code not in [4, 6]:
        return
    elif return_code == 4:
        message = build_message(
            result.game.owner.username,
            result,
            (
                "Evaluation script crashes\n\n"
                
                "Please see attachments for full error log and uploaded data\n"
            )
        )
    elif return_code == 6:
        message = build_message(
            result.game.owner.username,
            result,
            (
                "Evaluation script exited with unexpected return code \n\n"
                
                "Please only exit with a 0, 1 or 2 error code. Please check documentation for more details \n"
    
                "Please see attachments for full error log and uploaded data\n"
            )
        )
    email = EmailMessage(
        subject,
        message,
        email_from,
        recipient,
        attachments=[
            ("Console Log.txt", stdout, "text/plain"),
            ("uploaded_data.json", result.content, "application/json")
        ]
    )
    email.send()

def uploader_notification(return_code: int, stdout: str, result: UnprocessedResults):
    recipient = [result.player.user.email]
    email_from = settings.EMAIL_HOST_USER
    subject = f"PLAYER NOTIFICATION: Score processing failure in {result.game.name}"

    if return_code == 5:
        details = (
            f"Your result data was incorrectly formatted.\n\n"
            "The result data and error message have been attached to this email for reference.\n"
        )
    else: # 1, 2, 3, 4, 6
        details = (
            "An internal error occurred while processing the results. Please try again later.\n\n"
            "The result data has been attached to this email for reference.\n"
        )

    message = build_message (
        result.player.user.username,
        result,
        details
    )

    email = EmailMessage(
        subject,
        message,
        email_from,
        recipient,
        attachments=[
            ("uploaded_data.json", result.content, "application/json")
        ]
    )

    if return_code == 5:
        email.attach("Console Log.txt", stdout, "text/plain")

    email.send()


def email_handler(return_code: int, stdout: str, result: UnprocessedResults):
    if return_code == 0:
        return

    admin_notification(return_code, stdout, result)
    owner_notification(return_code, stdout, result)
    uploader_notification(return_code, stdout, result)


if __name__ == '__main__':
    main()
