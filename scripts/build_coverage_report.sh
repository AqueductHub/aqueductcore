#!/usr/bin/env bash

# Build pytest coverage report.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..

set -o pipefail

set -o allexport
source $PROJECT_ROOT/envs/.env.test set
set +o allexport


# create temp dir required for the Settings.
export EXPERIMENTS_DIR_PATH=$(mktemp -d)

python -m pytest --cov-config=$PROJECT_ROOT/.coveragerc \
--cov-report=term-missing:skip-covered \
--junitxml=$PROJECT_ROOT/pytest.xml --cov=$PROJECT_ROOT/aqueductcore \
$PROJECT_ROOT/tests/unittests | tee $PROJECT_ROOT/pytest-coverage.txt
if [[ $? -ne 0 ]]; then
unset pipefail
exit 1
else
unset pipefail
exit 0
fi
