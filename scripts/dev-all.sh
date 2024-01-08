#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
LOG_DIR=$BASE_DIR/.logs
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

##
# Clone some repositories that we'll need
##
mkdir -p $WORK_DIR
mkdir -p $LOG_DIR
cd $WORK_DIR
if [ ! -d "apicurio-api-designer" ]; then
  git clone git@github.com:Apicurio/apicurio-api-designer.git
else
  cd $WORK_DIR/apicurio-api-designer
  git stash
  git pull origin main
fi
cd $WORK_DIR
if [ ! -d "apicurio-registry" ]; then
  git clone git@github.com:Apicurio/apicurio-registry.git
else
  cd $WORK_DIR/apicurio-registry
  git stash
  git pull origin main
fi
cd $WORK_DIR
if [ ! -d "microcks" ]; then
  git clone git@github.com:microcks/microcks.git
else
  cd $WORK_DIR/microcks
  git stash
  git pull
fi


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


########################################################################
# Run all the components
########################################################################
source $BASE_DIR/dev-run.sh
