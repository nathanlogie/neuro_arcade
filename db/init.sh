#!/bin/bash

# Install and initialise postgress

if [ -z "${NEURO_ARCADE_DB_PASSWORD}" ]; then
    echo "Please enter a password for the database user."
    echo "The NEURO_ARCADE_DB_PASSWORD environment variable should be set to match"
    echo "this when running the django server."
    read -p "Password: " NEURO_ARCADE_DB_PASSWORD
fi

# Install postgres
sudo apt update
sudo apt install libpq-dev postgresql postgresql-contrib

# Create database
echo "DROP DATABASE neuro_arcade;
CREATE DATABASE neuro_arcade;
DROP USER django_user;
CREATE USER django_user WITH PASSWORD '$NEURO_ARCADE_DB_PASSWORD';
ALTER ROLE django_user SET client_encoding TO 'utf8';
ALTER ROLE django_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE django_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE neuro_arcade TO django_user;" \
    | sudo -u postgres psql
