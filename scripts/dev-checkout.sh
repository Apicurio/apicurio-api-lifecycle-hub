#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

##
# Clone or update some repositories that we'll need
##
mkdir -p $WORK_DIR
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
