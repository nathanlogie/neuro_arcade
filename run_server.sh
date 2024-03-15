#!/bin/bash

PYTHON='python3.9'
export NEURO_ARCADE=1

# run DB process
sh ./db/run.sh

# django server
screen -dmS django_server $PYTHON neuro_arcade/manage.py runserver

# frontend server
# shellcheck disable=SC2164
screen -dmS frontend_server bash -c "cd ./neuro_arcade/reactapp ; npm run build ; serve -s build"
