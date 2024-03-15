# Install and initialise postgress

# Install postgres
sudo apt update
sudo apt install libpq-dev postgresql postgresql-contrib

# Create database
cat init.sql | sudo -u postgres psql
