#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

# Run the locally built hub app on port 7070
cd $HUB_DIR/hub/app
export QUARKUS_HTTP_PORT=7070
mvn clean package quarkus:dev -DskipTests
