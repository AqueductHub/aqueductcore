#!/usr/bin/env bash

# this script downloads folder with extension from the remote
# git repository. Provide a repo URL and branch name to specify
# the source of extensions. They will be added to external/extension
# directory. If branch name is not provided, defaults to main.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
branch=${2:-main}
mytmpdir=${TMPDIR:-/tmp}

echo "======== Creating a temp dir ========"
where=$mytmpdir/external-extensions/
echo "TMP: $where"
rm -rf $where
mkdir -p $where

echo "=========== Cloning ================="
echo "$1 -> $where:"
git clone $1 -- $where
cd $where

echo "====== Switching a branch ==========="
echo "-> $branch"
git checkout $branch

echo "=========== Copying ================="
find $where/ -mindepth 1 -maxdepth 1 -type d -not \( -name ".git*" \) -exec cp -r "{}" $PROJECT_ROOT/external/extensions/ \;

echo "=========== Cleaning ================"
rm -rf $where
