#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
LOGS_DIR=$BASE_DIR/.logs
cd ..
HUB_DIR=`pwd`

mkdir -p $LOGS_DIR

echo ""
echo "---"
echo "Building some required dependencies that aren't yet docker images."
echo "---"

## 
# Do some software builds (be targeted to reduce time)
##
echo "Installing API Designer UI dependencies..."
echo "    tail -f $LOGS_DIR/api-designer-npm.log"
cd $WORK_DIR/apicurio-api-designer/ui
npm install &> $LOGS_DIR/api-designer-npm.log

echo "Installing Registry UI dependencies..."
echo "    tail -f $LOGS_DIR/api-designer-ui-npm.log"
cd $WORK_DIR/apicurio-registry/ui
npm install &> $LOGS_DIR/api-designer-ui-npm.log

echo "Installing Hub UI dependencies..."
echo "    tail -f $LOGS_DIR/hub-ui-npm.log"
cd $HUB_DIR/ui
npm install &> $LOGS_DIR/hub-ui-npm.log

echo "Generating Hub UI client SDKs..."
echo "    tail -f $LOGS_DIR/hub-ui-npm.log"
npm run generate-hub-client &> $LOGS_DIR/hub-ui-npm.log
npm run generate-workflows-client &> $LOGS_DIR/hub-ui-npm.log

echo "Building Hub app..."
echo "    tail -f $LOGS_DIR/hub-mvn.log"
cd $HUB_DIR/hub
mvn clean install -DskipTests &> $LOGS_DIR/hub-mvn.log

echo "Building Workflows app..."
echo "    tail -f $LOGS_DIR/hub-workflows-mvn.log"
cd $HUB_DIR/workflows
mvn clean install -DskipTests &> $LOGS_DIR/hub-workflows-mvn.log

echo "--"
echo "All builds complete."
echo "--"