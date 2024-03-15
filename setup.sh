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

#start
sh ./run_server.sh
