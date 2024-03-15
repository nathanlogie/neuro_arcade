#!/bin/bash

# Change WEBSITE_URL in neuro_arcade/neuro_arcade/settings.py to desired domain

apt-get update && upgrade -y

# database
sh ./db/init.sh
if [ $? -ne 0 ]; then
    echo "Error in database setup"
    exit 1
fi

# python
apt-get install python3
python -m ensurepip --upgrade

# npm
apt-get install nodejs

# ngix

apt-get install nginx

# Configure nginx-config.txt for any occurrences of the domain, you domain must have CA certification and configured
# for nginx with Let's Encrypt

cp nginx-config.txt /etc/nginx/sites-available/default

# IMPORTANT FOR MEDIA: edit /etc/nginx/nginx.conf and change the user at the first line to match the current user of the system

nginx -t
service nginx restart

# installing python dependencies
pip install -r ./neuro_arcade/requirements.txt

# installing npm dependencies
cd ./neuro_arcade/reactapp/
npm install
cd ../../

# Add Docker's official GPG key:
apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce
# install docker
apt install docker-ce
#run docker background process
systemctl enable docker
systemctl start docker

# creating the docker image for evaluating scripts
cd ./evaluation
sh docker_build.sh
cd ../

