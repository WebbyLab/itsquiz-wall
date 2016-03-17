import Jed from 'jed';

export function getSupportedLocales() {
    return ['ru', 'en', 'uk','zh_cn'];
}

export function sprintf(text, ...params) {
    return Jed.sprintf(text, ...params);
}
