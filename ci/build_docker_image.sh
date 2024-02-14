#!/usr/bin/env bash

# This script builds the docker images for a release
# -t Tag to tag images with, defaults to dev if not specified
# -i Docker image name
# -p Push built image to Dockerhub

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
set -e
set -o pipefail

tag="dev"
push="false"

while getopts "t:p:i:" flag
do 
    case "${flag}" in
        t) tag=${OPTARG};;
        i) image_name=${OPTARG};;
        p) push=${OPTARG};;
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

echo "Create sdist"
poetry build -f sdist

set -x

echo "Build static files"
docker run --rm -v ${PROJECT_ROOT}:/app node:16.20-bullseye bash -c \
    "bash /app/scripts/build_frontend.sh"

echo "Build docker image"

docker buildx create --use
docker buildx build -f $PROJECT_ROOT/containers/release/Dockerfile \
    -t aqueducthub/$image_name:$tag -t aqueducthub/$image_name:latest \
    -o type=docker,dest=$PROJECT_ROOT/build/$image_name.tar $PROJECT_ROOT

docker buildx stop


echo "Load docker images"
docker load -i build/$image_name.tar

if [[ $push != "false" ]]; then
    echo "Push docker images to DockerHub"
    docker image push aqueducthub/$image_name:$tag
    docker image push aqueducthub/$image_name:latest
fi
