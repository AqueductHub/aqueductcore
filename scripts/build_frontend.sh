#!/usr/bin/env bash

# This script builds frontend react app static files.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
set -e
set -o pipefail

source aqueductcore/frontend/envs/.env.prod
export $(cut -d= -f1 aqueductcore/frontend/envs/.env.prod)

rm -rf ${PROJECT_ROOT}/frontend_build \
&& cd ${PROJECT_ROOT}/aqueductcore/frontend \
&& rm -rf build \
&& yarn install \
&& yarn build \
&& mv build ${PROJECT_ROOT}/frontend_build
