#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work


# API Designer UI (dev mode) on port 8000
cd $WORK_DIR/apicurio-registry/ui/ui-app
./init-dev.sh
cp $BASE_DIR/configs/config-registry-ui.js config.js
export SERVER_PORT=8001
npm run dev
