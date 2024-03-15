# Install and initialise postgress

# Install postgres
sudo apt update
sudo apt install libpq-dev postgresql postgresql-contrib

# Create database
echo "CREATE DATABASE neuro_arcade;
CREATE USER django_user WITH PASSWORD '$NEURO_ARCADE_DB_PASSWORD';
ALTER ROLE django_user SET client_encoding TO 'utf8';
ALTER ROLE django_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE django_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE neuro_arcade TO django_user;" \
    | sudo -u postgres psql
