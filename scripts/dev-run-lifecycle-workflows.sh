#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

# Run the locally built workflows app on port 9002
cd $HUB_DIR/workflows/app
export QUARKUS_HTTP_PORT=9002
mvn clean package quarkus:dev -DskipTests
