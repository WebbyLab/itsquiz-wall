import Jed from 'jed';

export function getSupportedLocales() {
    return ['ru', 'en', 'uk', 'zhcn'];
}

export function sprintf(text, ...params) {
    return Jed.sprintf(text, ...params);
}
