#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

# Use docker compose to start up Microcks
# Microcks runs on port 8080
cd $WORK_DIR/microcks/install/docker-compose
docker compose -f docker-compose-devmode.yml up
