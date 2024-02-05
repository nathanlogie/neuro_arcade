#!/bin/bash

python3.9 manage.py sqlflush

# if this fails, then do 'python3.9 manage.py makemigrations'
python3.9 manage.py migrate

python3.9 populate.py
