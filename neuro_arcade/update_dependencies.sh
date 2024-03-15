#!/bin/sh

# installing python libs:
echo 'Updating pip packages:'
python -m pip install -r requirements.txt

# updating npm packages:
echo 'Updating npm packages:'
cd ./reactapp || exit;
npm install

echo 'All packages updated!'
