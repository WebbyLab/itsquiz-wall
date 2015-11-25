'use strict';

import Jed from 'jed';

export function extractSupportedLocaleFromPathname(path) {
    const searchPath = path.toLowerCase();
    const locales = getSupportedLocales();
    const DEFAULT_LOCALE = 'ru';

    return locales.find(locale => searchPath.indexOf(`/${locale}/`) !== -1) || DEFAULT_LOCALE;
}

export function getSupportedLocales(text, ...params) {
    return ['ru', 'en', 'uk'];
}

export function sprintf(text, ...params) {
    return Jed.sprintf(text, ...params);
}
