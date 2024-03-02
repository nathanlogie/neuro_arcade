#!/bin/bash

docker run -it --rm -v ./volume:/usr/src/app/volume/ --name running-evaluation evaluation-container
