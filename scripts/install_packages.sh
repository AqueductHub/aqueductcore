#!/usr/bin/env bash

# Installs Frontend/Backend packages.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..

cd $PROJECT_ROOT && poetry install
cd $PROJECT_ROOT/aqueductcore/frontend && yarn install
