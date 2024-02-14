#!/usr/bin/env bash

# This script builds frontend react app static files.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
set -e
set -o pipefail

rm -rf ${PROJECT_ROOT}/frontend_build \
&& cd ${PROJECT_ROOT}/aqueductcore/frontend \
&& rm -rf build \
&& yarn install \
&& yarn build \
&& mv build ${PROJECT_ROOT}/frontend_build
