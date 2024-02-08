#!/usr/bin/env bash

# This script generates license html table that will be posted in comment on PR

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
FRONTEND_DIR=$PROJECT_ROOT/aqueductcore/frontend

backend_licenses=$(poetry run pip-licenses --format=html --order=license)
frontend_licenses=$(yarn --cwd $FRONTEND_DIR run check-licenses | sed -n '/<table>/,/<\/table>/p')

echo "<h3>Dependency License List</h3><details><summary>Used Python Packages' Licenses</summary>$backend_licenses</details><details><summary>Used Node Modules' Licenses</summary>$frontend_licenses</details>" > licenses.html