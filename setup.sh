#!/bin/bash

apt-get update && upgrade -y

# database
sh ./db/init.sh

# python
apt-get install python3
python -m ensurepip --upgrade

# npm
apt-get install nodejs

# ngix
apt-get install nginx
cp nginx-config.txt /etc/nginx/sites-available/default
nginx -t
service nginx restart

# installing python dependencies
pip install -r ./neuro_arcade/requirements.txt

# installing npm dependencies
cd ./neuro_arcade/reactapp/
npm install
cd ../../

# creating the docker image for evaluating scripts
cd ./evaluation/
sh docker_build.sh
cd ../

# start
sh ./run_server.sh
