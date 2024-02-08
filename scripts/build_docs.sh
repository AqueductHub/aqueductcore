#!/bin/bash
# This script builds the docs

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..

set -ex


if [ -d "$PROJECT_ROOT/site" ]; then
    rm -rf $PROJECT_ROOT/site
fi


# Build static website
poetry run mkdocs build --clean --verbose


# Copy web assets and substitute DOC_DIR variable in index.html
cp -r $PROJECT_ROOT/ci/staticwebapp.config.json $PROJECT_ROOT/site
