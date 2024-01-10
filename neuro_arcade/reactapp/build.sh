#!/bin/bash

# ---------------------
#  BUILD SCRIPT
#   for the React App
# ---------------------

# build with npm
npm run build

# renames 'index.html' to 'react_index.html'
# so it doesn't conflict with the index in /templates/
mv ./build/index.html ./build/react_index.html

echo 'React App built!'