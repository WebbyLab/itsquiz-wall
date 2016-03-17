#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

node "${ROOT_DIR}/node_modules/babel/bin/babel" "${ROOT_DIR}/shared" -d "${ROOT_DIR}/src_es5";
find "${ROOT_DIR}/src_es5" -type f \( -name '*.js' \) -print > "${ROOT_DIR}/list";

xgettext -kl --files-from="${ROOT_DIR}/list" --language=JavaScript --from-code=UTF-8 -j -o "${ROOT_DIR}/lang/en.po";
xgettext -kl --files-from="${ROOT_DIR}/list" --language=JavaScript --from-code=UTF-8 -j -o "${ROOT_DIR}/lang/ru.po";
xgettext -kl --files-from="${ROOT_DIR}/list" --language=JavaScript --from-code=UTF-8 -j -o "${ROOT_DIR}/lang/uk.po";
xgettext -kl --files-from="${ROOT_DIR}/list" --language=JavaScript --from-code=UTF-8 -j -o "${ROOT_DIR}/lang/tr.po";

rm -rf "${ROOT_DIR}/src_es5";
rm -rf "${ROOT_DIR}/list";
