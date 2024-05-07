#!/usr/bin/env bash

# This script generates license html table that will be posted in comment on PR

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
FRONTEND_DIR=$PROJECT_ROOT/aqueductcore/frontend

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


yarn install --cwd $FRONTEND_DIR

export BACKEND_LICENSES=$(poetry run pip-licenses --format=markdown --order=license)
# export FRONTEND_LICENSES=$(yarn --cwd $FRONTEND_DIR run check-licenses | sed -n '/<table>/,/<\/table>/p')
export FRONTEND_LICENSES=$(yarn --cwd $FRONTEND_DIR run -s license-report --only=prod --config=$SCRIPT_DIR/license-report-config.json)

cat $SCRIPT_DIR/license_report_template.md | envsubst > license_report.md
