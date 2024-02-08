#!/usr/bin/env bash

# This script removes the containers.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)

export EXPERIMENTS_DIR=$HOME/aqueduct_experiments

docker compose -f $SCRIPT_DIR/docker-compose.yaml down
