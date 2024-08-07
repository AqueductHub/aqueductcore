#!/usr/bin/env bash

# Start Celery Worker Service

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..

poetry run aqueduct worker
