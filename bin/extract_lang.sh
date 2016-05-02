#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

function extract_lang {
    local locale=$1;

    xgettext --keyword="l:1" \
             --keyword="l:1,2c" \
             --keyword="nl:1,2" \
             --keyword="nl:1,2,4c" \
             --files-from="${ROOT_DIR}/list" \
             --language=JavaScript \
             --no-location \
             --from-code=UTF-8 \
             --join-existing \
             --output="${ROOT_DIR}/lang/${locale}.po";
}

node "${ROOT_DIR}/node_modules/babel-cli/bin/babel" "${ROOT_DIR}/shared" -d "${ROOT_DIR}/src_es5";
find "${ROOT_DIR}/src_es5" -type f \( -name '*.js' \) -print > "${ROOT_DIR}/list";

extract_lang "en";
extract_lang "ru";
extract_lang "uk";
extract_lang "tr";

rm -rf "${ROOT_DIR}/src_es5";
rm -rf "${ROOT_DIR}/list";
