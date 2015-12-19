'use strict';

import Jed from 'jed';

export function getSupportedLocales(text, ...params) {
    return ['ru', 'en', 'uk'];
}

export function sprintf(text, ...params) {
    return Jed.sprintf(text, ...params);
}
