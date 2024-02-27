#!/bin/bash

python manage.py sqlflush

# if this fails, then do 'python3.9 manage.py makemigrations'
python manage.py migrate

python populate.py
