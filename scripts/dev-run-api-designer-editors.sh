#!/bin/sh
set -e

# Needed to pull in 'nvm', which is set up in .bashrc
: ${NVM_DIR=$HOME/.nvm} # Set NVM_DIR if it's not already configured
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work


# API Designer Editors (dev mode) on port 9011
cd $WORK_DIR/apicurio-api-designer/ui/ui-editors
nvm use 16
npm run dev
