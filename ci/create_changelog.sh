#!/bin/bash
# This script creates a changelog for a given repo since the last release.

FULL_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $FULL_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
set -e
set -o pipefail

cd $PROJECT_ROOT

while getopts "o:" flag
do 
    case "${flag}" in
        o) output=${OPTARG};;
    esac
done

if [[ -z $output ]]; then
    echo "An output file must be provided"
    exit 1
fi

if [[ -z $(which conventional-changelog) ]]; then
    sudo npm install -g conventional-changelog-cli >/dev/null
fi

set +e
full_changelog=$(conventional-changelog -r 2 | grep "*")
breaking_changelog=$(conventional-changelog -r 2 | grep "* feat!:")
feat_changelog=$(conventional-changelog -r 2 | grep "* feat:")
fix_changelog=$(conventional-changelog -r 2 | grep "* fix:")
set -e
tag=$(echo $(git tag --sort creatordate --merged) | awk -F " " '{print $NF}')

if [[ -z $full_changelog ]]; then
    full_changelog="Changes in repo dependencies only."
fi

changelog=""
if [[ -n $breaking_changelog ]]; then
    changelog="$changelog### ⚠ BREAKING CHANGES
${breaking_changelog}
"
fi

if [[ -n $feat_changelog ]]; then
    changelog="$changelog### 🎁 New Features
${feat_changelog}
"
fi

if [[ -n $fix_changelog ]]; then
    changelog="$changelog### 🛠 Fixes
${fix_changelog}"
fi

if [[ $tag == "valready-released" ]]; then
    changelog="Already released - no changes."
    git tag -d "valready-released"
    tag=$(echo $(git tag --sort creatordate --merged) | awk -F " " '{print $NF}')
fi

cd $PROJECT_ROOT

echo "## $tag Changes" >> $output
echo "$changelog" >> $output
