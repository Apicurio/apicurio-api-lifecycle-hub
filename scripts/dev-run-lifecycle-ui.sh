#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

# Run hub UI on port 8888
cd $HUB_DIR/ui
source ./init-dev.sh
cp $BASE_DIR/configs/config-api-lifecycle-ui.js config.js
npm run dev
