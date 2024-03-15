# Database scripts

This folder contains scripts for the postgresql database to set up, intended to be used in
production. The django server will only use this if the `NEURO_ARCADE` environment variable is
set.

## init.sh

`init.sh` will install the required packages and initialise the database. This only needs to be ran
once. Running it again will cause the database to be reset. The `NEURO_ARCADE_DB_PASSWORD`
environment variable should be set before doing this.

## run.sh

`run.sh` will setup the background process for the database. This needs to be ran after every
operating system reboot.
