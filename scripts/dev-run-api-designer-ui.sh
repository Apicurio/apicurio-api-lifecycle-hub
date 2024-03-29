#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work


# API Designer UI (dev mode) on port 8000
cd $WORK_DIR/apicurio-api-designer/ui/ui-app
./init-dev.sh
cp $BASE_DIR/configs/config-api-designer-ui.js config.js
export SERVER_PORT=8000
npm run dev
