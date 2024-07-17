set -x
cwd=$(pwd)
mytmpdir=${TMPDIR:-/tmp}
where=$mytmpdir/external-extensions/
branch=${2:-main}
rm -rf $where
mkdir -p $where
echo "$1 -> $where:"
git clone $1 -- $where
cd $where
git checkout $branch
find $where/ -mindepth 1 -maxdepth 1 -type d -not \( -name ".git*" \) -exec cp -r "{}" $cwd/external/extensions/ \;
rm -rf $where