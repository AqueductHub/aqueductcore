#!/usr/bin/env bash

# Runs Python unit tests using pytest.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..

set -o allexport
source $PROJECT_ROOT/envs/.env.test set
set +o allexport

# create temp dir required for the Settings.
export EXPERIMENTS_DIR_PATH=$(mktemp -d)
export PLUGINS_DIR_PATH=$PROJECT_ROOT/plugins

poetry run pytest $PROJECT_ROOT/tests/unittests -rA -vv
