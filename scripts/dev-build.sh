#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`


## 
# Do some software builds (be targeted to reduce time)
##
cd $WORK_DIR/apicurio-api-designer/ui
npm install
cd $WORK_DIR/apicurio-registry/ui
npm install
cd $WORK_DIR/apicurio-registry/client
mvn clean install
cd $HUB_DIR/hub/client
mvn clean install
cd $HUB_DIR/workflows/client
mvn clean install
cd $HUB_DIR/ui
npm install

cd $HUB_DIR/hub
mvn clean install
cd $HUB_DIR/workflows
mvn clean install

