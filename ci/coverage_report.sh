#!/usr/bin/env bash

# This script generates coverage report.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
set -e
set -o pipefail

cd $PROJECT_ROOT

if [[ -z $(which poetry) ]]; then
    echo "Installing poetry"
    export POETRY_HOME=$HOME/.local
    curl -sSL https://install.python-poetry.org | python3 - --version 1.5.1
    export PATH="$POETRY_HOME/bin:$PATH"
    poetry config virtualenvs.in-project false
fi

echo "Installing dependencies"
poetry install

echo "Build coverage report"
poetry run $PROJECT_ROOT/scripts/build_coverage_report.sh
