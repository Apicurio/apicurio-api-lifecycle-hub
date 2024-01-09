#!/bin/sh
set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR
BASE_DIR=`pwd`
WORK_DIR=$BASE_DIR/.work
cd ..
HUB_DIR=`pwd`

echo ""
echo "---"
echo "Starting up all Lifecycle Hub components."
echo "---"

########################################################################
# Open gnome-terminal with a bunch of tabs - one for each component
########################################################################

gnome-terminal --window \
  --working-directory=$BASE_DIR --title='API Designer' --command="bash -c ./dev-run-api-designer.sh" \
  --tab --working-directory=$BASE_DIR --title='API Designer UI' --command="bash -c ./dev-run-api-designer-ui.sh" \
  --tab --working-directory=$BASE_DIR --title='API Designer Editors' --command="bash -c ./dev-run-api-designer-editors.sh" \
  --tab --working-directory=$BASE_DIR --title='Registry' --command="bash -c ./dev-run-registry.sh" \
  --tab --working-directory=$BASE_DIR --title='Registry UI' --command="bash -c ./dev-run-registry-ui.sh" \
  --tab --working-directory=$BASE_DIR --title='Microcks' --command="bash -c ./dev-run-microcks.sh" \
  --tab --working-directory=$BASE_DIR --title='Lifecycle Workflows' --command="bash -c ./dev-run-lifecycle-workflows.sh" \
  --tab --working-directory=$BASE_DIR --title='Lifecycle Hub' --command="bash -c ./dev-run-lifecycle-hub.sh" \
  --tab --working-directory=$BASE_DIR --title='Lifecycle UI' --command="bash -c ./dev-run-lifecycle-ui.sh"
