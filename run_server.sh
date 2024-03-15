#!/bin/bash

PYTHON='python'
export NEURO_ARCADE=1

# run postgresql DB process
cd db
sh ./run.sh
cd ../

# django server
screen -dmS django_server $PYTHON ./neuro_arcade/manage.py runserver

# compiling the reactapp
screen -dmS frontend_server bash -c "cd ./neuro_arcade/reactapp ; npm run build "
