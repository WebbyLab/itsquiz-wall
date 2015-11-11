'use strict';

import Jed from 'jed';

export function extractSupportedLocaleFromPathname(path) {
    const SUPPORTED_LOCALES = ['ru', 'en', 'uk'];
    const DEFAULT_LOCALE = 'ru';

    return SUPPORTED_LOCALES.find(locale => path.indexOf(`/${locale}/`) !== -1) || DEFAULT_LOCALE;
}

export function sprintf(text, ...params) {
    return Jed.sprintf(text, ...params);
}
