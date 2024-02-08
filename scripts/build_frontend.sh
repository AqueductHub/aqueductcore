#!/usr/bin/env bash

# This script builds frontend react app static files.
# -a Enable alpha features

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
set -e
set -o pipefail

while getopts "a:" flag
do 
    case "${flag}" in
        a) alpha=${OPTARG};;
    esac
done

if [[ -z $alpha ]]; then
    echo "Alpha features activation should be explicitly provided."
    exit 1
fi

rm -rf ${PROJECT_ROOT}/frontend_build \
&& cd ${PROJECT_ROOT}/aqueductcore/frontend \
&& rm -rf build \
&& yarn install \
&& REACT_APP_ALPHA_FEATURE=$alpha REACT_APP_JUST_AQD=true yarn build \
&& mv build ${PROJECT_ROOT}/frontend_build
