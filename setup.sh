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

# Add Docker's official GPG key:
apt-get update
apt-get install ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
# install docker
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# creating the docker image for evaluating scripts
cd ./evaluation/
sh docker_build.sh
cd ../

# start
sh ./run_server.sh
