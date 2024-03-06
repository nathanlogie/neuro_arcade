# Must run with sudo via commandline

import os
import sys

import django
from django.conf import settings
from django.core.mail import send_mail

sys.path.insert(0, '../neuro_arcade')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuro_arcade.settings')
django.setup()

subject = 'Neuro Arcade'
message = 'Hi, Developers!!!!.'
email_from = settings.EMAIL_HOST_USER
recipient_list = [""]
send_mail(subject, message, email_from, recipient_list)
