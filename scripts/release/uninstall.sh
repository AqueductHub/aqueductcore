#!/usr/bin/env bash

# This script removes the containers.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)

export EXPERIMENTS_DIR=$HOME/aqueduct_experiments
export EXTENSIONS_DIR=$HOME/external/extensions

docker compose -f $SCRIPT_DIR/docker-compose.yaml down
