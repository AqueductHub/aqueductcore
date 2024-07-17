cwd=$(pwd)
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
find $where/ -mindepth 1 -maxdepth 1 -type d -not \( -name ".git*" \) -exec cp -r "{}" $cwd/external/extensions/ \;

echo "=========== Cleaning ================"
rm -rf $where
