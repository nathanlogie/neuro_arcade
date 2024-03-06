# #
# # from django.conf import settings
# # from django.core.mail import send_mail
# #
# # settings.configure()
# #
# # port = 587  # For starttls
# # smtp_server = "smtp.gmail.com"
# # sender_email = "arcadeneuro@gmail.com"
# # receiver_email = ""
# # password = ""
# # message = """\
# # Subject: Hi there
# #
# # This message is sent from Python."""
# #
# # send_mail(
# #     subject='A cool subject',
# #     message=message,
# #     from_email=settings.EMAIL_HOST_USER,
# #     recipient_list=[receiver_email],
# #     fail_silently=False
# # )
# from django.conf import settings
# from django.core.mail import send_mail
# from django.template.loader import render_to_string
# settings.configure()
#
# def sendConfirmEmail(email, code):
#     mail_subject = 'Confirmation code {}'.format(code)
#     message = "Hello"
#     to_email = email
#     send_mail(mail_subject, message, 'arcadeneuro@gmail.com', [to_email],
#               fail_silently=False)
#
#
# sendConfirmEmail('nathanlogie20@gmail.com', 1234)

from django.conf import settings
from django.core.mail import send_mail

settings.configure()

subject = 'welcome to GFG world'
message = f'Hi, thank you for registering in geeksforgeeks.'
email_from = settings.EMAIL_HOST_USER
recipient_list = []
send_mail(subject, message, email_from, recipient_list )

