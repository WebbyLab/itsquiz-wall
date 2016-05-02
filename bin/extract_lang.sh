#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

# Transpile to ES5
node "${ROOT_DIR}/node_modules/babel-cli/bin/babel" "${ROOT_DIR}/shared" -d "${ROOT_DIR}/src_es5";
find "${ROOT_DIR}/src_es5" -type f \( -name '*.js' \) -print > "${ROOT_DIR}/list";

# Extract phrases from source code and update exising PO files
xgettext --keyword="l:1" \
         --keyword="l:1,2c" \
         --keyword="nl:1,2" \
         --keyword="nl:1,2,4c" \
         --files-from="${ROOT_DIR}/list" \
         --language=JavaScript \
         --no-location \
         --from-code=UTF-8 \
         --output="${ROOT_DIR}/lang/messages.pot";

msgmerge --backup=off -U "${ROOT_DIR}/lang/ru.po" "${ROOT_DIR}/lang/messages.pot";
msgmerge --backup=off -U "${ROOT_DIR}/lang/uk.po" "${ROOT_DIR}/lang/messages.pot";
msgmerge --backup=off -U "${ROOT_DIR}/lang/tr.po" "${ROOT_DIR}/lang/messages.pot";

# Cleanup
rm -rf "${ROOT_DIR}/src_es5";
rm -rf "${ROOT_DIR}/list";
rm "${ROOT_DIR}/lang/messages.pot";
