#!/usr/bin/env bash

# This script loads and starts the containers.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)

export EXPERIMENTS_DIR=$HOME/aqueduct_experiments

mkdir -p $EXPERIMENTS_DIR

# load Aqueduct docker image
docker load -i $SCRIPT_DIR/aqueductcore.tar

docker compose -f $SCRIPT_DIR/docker-compose.yaml up -d
