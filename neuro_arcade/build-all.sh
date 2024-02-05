#!/bin/bash

# path to DB file
DB="./db.sqlite3"
REACT_BUILD="sh ./build.sh"

echo "Starting build-all script!"

# Database
if [ -f $DB ]
then
  echo " Database found!"
else
  echo " Database not found! Building it with rebuild-db.sh:"
  sh rebuild-db.sh
fi

# npm: building the reactapp
echo " Building the reactapp:"
cd ./reactapp/ || exit
$REACT_BUILD
cd ..

# Run server
echo " Running Server:"
python3.9 manage.py runserver
