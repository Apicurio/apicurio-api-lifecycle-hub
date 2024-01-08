#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

##
# Clone some repositories that we'll need
##
$BASE_DIR/dev-checkout.sh

## 
# Do some software builds (be targeted to reduce time)
##
$BASE_DIR/dev-build.sh


########################################################################
# Run all the components
########################################################################
$BASE_DIR/dev-run.sh
