#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
LOGS_DIR=$BASE_DIR/.logs
cd ..
HUB_DIR=`pwd`

echo "---"
echo "Checking out some required projects from GitHub.
echo "---

##
# Clone or update some repositories that we'll need
##
mkdir -p $WORK_DIR
cd $WORK_DIR
echo "Cloning or updating apicurio-api-designer..."
if [ ! -d "apicurio-api-designer" ]; then
  git clone git@github.com:Apicurio/apicurio-api-designer.git &> $LOGS_DIR/git.api-designer.log
else
  cd $WORK_DIR/apicurio-api-designer
  git stash &> $LOGS_DIR/git.api-designer.log
  git pull origin main &> $LOGS_DIR/git.api-designer.log
fi

echo "Cloning or updating apicurio-registry..."
cd $WORK_DIR
if [ ! -d "apicurio-registry" ]; then
  git clone git@github.com:Apicurio/apicurio-registry.git &> $LOGS_DIR/git.registry.log
else
  cd $WORK_DIR/apicurio-registry
  git stash &> $LOGS_DIR/git.registry.log
  git pull origin main &> $LOGS_DIR/git.registry.log
fi

echo "Cloning or updating microcks..."
cd $WORK_DIR
if [ ! -d "microcks" ]; then
  git clone git@github.com:microcks/microcks.git &> $LOGS_DIR/git.microcks.log
else
  cd $WORK_DIR/microcks
  git stash &> $LOGS_DIR/git.microcks.log
  git pull &> $LOGS_DIR/git.microcks.log
fi
