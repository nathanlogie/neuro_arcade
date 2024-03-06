# python:alpine produces smaller images, but you can encounter issues
# see this discussion: https://news.ycombinator.com/item?id=10782897
FROM python:3

# add your name here if you work on this docker image
# of should this include the entire team?
LABEL authors="Andrei Ghita <andrei.ghita2002@gmail.com>"

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./main.py main.py

CMD [ "python", "./main.py" ]
