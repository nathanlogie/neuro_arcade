# python:alpine produces smaller images, but you can encounter issues
# see this discussion: https://news.ycombinator.com/item?id=10782897
FROM python:3.12

# add your name here if you work on this docker image
# of should this include the entire team?
LABEL authors="Andrei Ghita <andrei.ghita2002@gmail.com>, Daniel Hally <2660097h@student.gla.ac.uk>, Eilidh Macdonald <2660212m@student.gla.ac.uk>, Nathan Logie <2658532l@student.gla.ac.uk>"

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./main.py main.py

# -B used to prevent __pycache__ being created in the volume folder
# and causing permission errors
CMD [ "python", "-B", "./main.py" ]
