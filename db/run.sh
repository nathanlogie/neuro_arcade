#!/bin/bash

# Setup background process for postgres

sudo systemctl start postgresql
sudo systemctl enable postgresql
