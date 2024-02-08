#!/usr/bin/env bash

# This script builds the docker images for a release
# -t Tag to tag images with, defaults to dev if not specified
# -d Path to docs docker image, pulls latest docs docker image from registry if not specified.
# -i Type of the image, release or test
# -a Enable alpha features
# -p Push built images to azurecr.io

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
set -e
set -o pipefail

tag="dev"
push="false"

while getopts "t:d:p:i:a:" flag
do 
    case "${flag}" in
        t) tag=${OPTARG};;
        d) docs=${OPTARG};;
        p) push=${OPTARG};;
        i) image_type=${OPTARG};;
        a) alpha=${OPTARG};;
    esac
done

mkdir build

if [[ -z $(which poetry) ]]; then
echo "Installing poetry"
    export POETRY_HOME=$HOME/.local
    curl -sSL https://install.python-poetry.org | python3 - --version 1.5.1
    export PATH="$POETRY_HOME/bin:$PATH"
    poetry config virtualenvs.in-project false
fi

echo "Create sdist aqueductcore"
poetry build -f sdist

set -x

echo "Build aqueductcore static files"
docker run --rm -v ${PROJECT_ROOT}:/app node:16.20-bullseye bash -c \
    "bash /app/scripts/build_frontend.sh -a $alpha"

echo "Build aqueductcore docker image"

docker buildx create --use
docker buildx build -f $PROJECT_ROOT/containers/release/Dockerfile \
    -t aqueductcore/$image_type:$tag -t aqueductcore/$image_type:latest \
    -t riverlane.azurecr.io/aqueducthub/aqueductcore/$image_type:$tag \
    -t riverlane.azurecr.io/aqueducthub/aqueductcore/$image_type:latest -o type=docker,dest=$PROJECT_ROOT/build/aqueductcore.tar $PROJECT_ROOT

docker buildx stop


echo "Load docker images"
docker load -i build/aqueductcore.tar

if [[ $push != "false" ]]; then
    echo "Push docker images"
    docker image push riverlane.azurecr.io/aqueducthub/aqueductcore/$image_type:$tag
    docker image push riverlane.azurecr.io/aqueducthub/aqueductcore/$image_type:latest
fi
