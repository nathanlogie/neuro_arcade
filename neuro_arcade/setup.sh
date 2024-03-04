#!/bin/bash

# installing python libs:
echo 'Updating pip packages:'
cd ..
python -m pip install -r requirements.txt

# updating npm packages:
echo 'Updating npm packages:'
cd ./neuro_arcade/reactapp || exit;
npm install

echo 'All packages updated!'
