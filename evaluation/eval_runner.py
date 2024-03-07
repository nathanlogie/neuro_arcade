# MAKE SURE YOU RUN THIS FILE FROM INSIDE /evaluation/ !!!
import sys
import os

from django.conf import settings
from django.core.mail import EmailMessage

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
import django
django.setup()

from enum import IntEnum
import json
import shutil
import subprocess
from tempfile import TemporaryDirectory
from threading import Thread
import time

from django.db import transaction
from django.db.utils import OperationalError

from na.models import UnprocessedResults, Score, validate_score


class EvalError(IntEnum):
    # Ran successfully
    NONE = 0

    # Docker custom volume wasn't accessible
    VOLUME_NOT_FOUND = 1

    # Docker volume/evaluation.py not found
    EVAL_NOT_FOUND = 2

    # Docker volume/input.txt not found
    RESULT_NOT_FOUND = 3

    # Evaluation script crashed
    # Exited with code 1
    EVAL_CRASHED = 4

    # Evaluation script reported bad input
    # Exited with code 2
    RESULT_BAD_FORMAT = 5

    # Evaluation script return code unexpected
    # Exited with code not in 0-2
    EVAL_BAD_RETURN = 6

    # Score validation failed
    # Evaluation script output didn't match score type
    SCORE_BAD_FORMAT = 7


# Time to wait in seconds before polling the database again if
# there were no scores available the last time
POLLING_TIME = 1

# Time to wait in seconds before trying again when the connection
# to the email server is refused
RESET_TIME = 30

# Global queue of emails which need to be sent
email_list = []

def main():
    """Entry point, spawns worker threads"""

    if len(sys.argv) < 2:
        print('Usage: eval_runner.py <number of runner>') 
        return 1

    # Build docker image first
    subprocess.run(["docker", "build", "-t", "evaluation-container", "./image"])

    # Spawn requested number of evaluation workers
    num_of_workers = int(sys.argv[1])
    for i in range(num_of_workers):
        t = Thread(target=worker_thread, args=[])
        t.start()

    # Start a single email worker thread
    t = Thread(target=email_worker, args=[])
    t.start()


#####################
# Result processing #
#####################


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
    """Main thread for an evaluation worker
    Polls the database for results to process and runs their evaluation"""

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

        return_code = proc.returncode

        # Handle errors
        if return_code == EvalError.NONE:

            score_data = json.loads(proc.stdout.decode())
            success, msg = validate_score(result.game.score_type, score_data)
            if not success:
                output = msg
                return_code = EvalError.SCORE_BAD_FORMAT

        if return_code == EvalError.NONE:
            # Add score to database
            score = Score.objects.create(
                game=result.game,
                player=result.player,
                score=score_data
            )
            score.save()

            # Delete unneeded result data
            result.delete()
        else:
            # Log to database
            result.status = 2
            result.errors = output
            result.save()

            # Email required users
            email_handler(return_code, output, result)


##################
# Email handling #
##################

def email_worker():
    """Main thread for the email worker
    Polls email_list for emails and attempts to send them"""

    while True:
        # Check if an email is ready to send
        try:
            email_to_send = email_list.pop()
        except IndexError:
            time.sleep(POLLING_TIME)
            continue

        # Attempt to send email
        try:
            # email_to_send.send()
            print(email_to_send.message())
        except Exception as e:
            # Retry later if connection refused
            # smtplib has a range of errors and we seem to keep hitting new
            # ones, so a blanket exception is used for now
            email_list.append(email_to_send)
            time.sleep(RESET_TIME)


def build_message(name: str, result: UnprocessedResults, details: str) -> str:
    """Helper to build the email message body"""

    return (
        f"Hi {name} \n\n"
    
        f"The following attempted upload of game results has failed: \n\n"
    
        f"Upload: results for {result.player.user.username} in {result.game.name} at "
        f"{result.upload_date.strftime('%Y-%m-%d %H-%M-%S')}\n"
        f"{details}\n\n"
        
        "Team @ NeuroArcade"
    )


def admin_notification(return_code: EvalError, stdout: str, result: UnprocessedResults):
    """Handler for emailing admins on errors"""

    recipient = [settings.ADMIN_EMAIL]
    email_from = settings.EMAIL_HOST_USER
    subject = f"ADMIN NOTIFICATION: Docker Failure in {result.game.name}"
    message = ""
    if return_code not in [EvalError.VOLUME_NOT_FOUND, EvalError.EVAL_NOT_FOUND, EvalError.RESULT_NOT_FOUND]:
        return
    elif return_code == EvalError.VOLUME_NOT_FOUND:
        message = build_message(
            "Admin",
            result,
            (
                f"Upload: {result} \n"
                f"Error Code: {return_code} - The volume folder could not be found (Issue with docker run command) \n\n"
                "Please see attached for full error log and uploaded data"
            )
        )
    elif return_code == EvalError.EVAL_NOT_FOUND:
        message = build_message(
            "Admin",
            result,
            (
                f"Upload: {result} \n"
                f"Error Code: {return_code} - The evaluation script could not be found \n\n"
                "Please see attached for full error log and uploaded data"
            )
        )
    elif return_code == EvalError.RESULT_NOT_FOUND:
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
    email_list.append(email)


def owner_notification(return_code: EvalError, stdout: str, result: UnprocessedResults):
    """Handler for emailing game owners on errors"""

    recipient = [result.game.owner.email]
    email_from = settings.EMAIL_HOST_USER
    subject = f"GAME NOTIFICATION: Score Processing Failure in {result.game.name}"
    message = ""
    if return_code not in [EvalError.EVAL_CRASHED, EvalError.EVAL_BAD_RETURN]:
        return
    elif return_code == EvalError.EVAL_CRASHED:
        message = build_message(
            result.game.owner.username,
            result,
            (
                "Evaluation script crashes\n\n"
                
                "Please see attachments for full error log and uploaded data\n"
            )
        )
    elif return_code == EvalError.EVAL_BAD_RETURN:
        message = build_message(
            result.game.owner.username,
            result,
            (
                "Evaluation script exited with unexpected return code \n\n"
                
                "Please only exit with a 0, 1 or 2 error code. Please check documentation for more details \n"
    
                "Please see attachments for full error log and uploaded data\n"
            )
        )
    elif return_code == EvalError.SCORE_BAD_FORMAT:
        message = build_message(
            result.game.owner.username,
            result,
            (
                "Evaluation script did not produce correct score type"

                "Please ensure your evaluation script and score types are matching, you can edit this through the edit page \n"

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
    email_list.append(email)


def uploader_notification(return_code: int, stdout: str, result: UnprocessedResults):
    """Handler for emailing result uploaders on errors"""

    recipient = [result.player.user.email]
    email_from = settings.EMAIL_HOST_USER
    subject = f"PLAYER NOTIFICATION: Score processing failure in {result.game.name}"

    if return_code == EvalError.RESULT_BAD_FORMAT:
        details = (
            f"Your result data was incorrectly formatted.\n\n"
            "The result data and error message have been attached to this email for reference.\n"
        )
    else: # 1, 2, 3, 4, 6, 7
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

    if return_code == EvalError.RESULT_BAD_FORMAT:
        email.attach("Console Log.txt", stdout, "text/plain")

    email_list.append(email)


def email_handler(return_code: EvalError, stdout: str, result: UnprocessedResults):
    """Handler for emailing involved parties on errors"""

    admin_notification(return_code, stdout, result)
    owner_notification(return_code, stdout, result)
    uploader_notification(return_code, stdout, result)


if __name__ == '__main__':
    main()
