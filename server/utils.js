'use strict';
import Promise from 'bluebird';
import geoip   from 'geoip-lite';

import clientConfig from '../etc/client-config.json';
import { getSupportedLocales } from '../shared/utils';

const DEFAULT_LOCALE='en';

export function fetchComponentsData(dispatch, components, params, query) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;
        return component.fetchData
            ? component.fetchData(dispatch, params, query)
            : null;
    });

    return Promise.all(promises);
}

export function getMetaDataFromState({ route, state }) {
    switch (route) {
        case '/activations/:id':
            const { name, message, pictureURL } = state.currentActivation.activation;
            return {
                title       : name,
                siteName    : "It's quiz",
                image       : pictureURL ? pictureURL.replace('svg', 'png') : '',
                description : message
            };
        default:
            return {
                title       : 'Quiz Wall',
                siteName    : 'It\'s quiz',
                image       : 'http://app.itsquiz.com/be/static/images/logo.png',
                description : 'Discover tons of different vacancies, tests, quizzes, questionnaires and more...'
            };
    }
}

export function makeRedirectUrl({originalUrl}) {
    const UIWallPath = `${clientConfig.embedOrigin}/quizwall`;
    return `${UIWallPath}${originalUrl}`;
}

export function detectLocale(req) {
    const defaultLocale = 'en';
    let locale = req.query.locale || req.cookies.locale;

    if (!locale) {
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
        const geo = geoip.lookup(ip);

        if (geo && geo.country) {
            locale = {
                'UA': 'uk',
                'RU': 'ru'
            }[geo.country] || 'en';
        }
    }

    const isLocaleSupported = getSupportedLocales().indexOf(locale) >= 0;
    return isLocaleSupported ? locale : DEFAULT_LOCALE;
}

