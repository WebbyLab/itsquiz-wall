/* eslint import/no-unresolved: 0*/

import Promise     from 'bluebird';
import geoip       from 'geoip-lite';
import strformat   from 'strformat';

import webpackAssets from '../etc/webpack-assets.json';

import clientConfig              from '../shared/config';
import { getSupportedLocales }   from '../shared/utils';

export function fetchComponentsData({ dispatch, components, params, query, locale }) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;

        return component.fetchData
            ? component.fetchData({ dispatch, params, query, locale })
            : null;
    });

    return Promise.all(promises);
}

export function getMetaDataFromState({ route, state, params = {}, query = {}, lang }) {
    /* eslint more/no-duplicated-chains: 0 */
    if (route === '/activations/:id' || route === '/activations/:id/:title') {
        const { name, message, pictureURL } = state.currentActivation.activation;

        return {
            type        : 'ACTIVATION',
            title       : name,
            siteName    : "It's quiz",
            image       : pictureURL ? pictureURL.replace('svg', 'png') : '',
            description : message
        };
    }

    if (route === '/result/:id/:accountId' && state.currentActivation.activation) {
        const { name, pictureURL, message, accountQuizSession } = state.currentActivation.activation;

        const greeting = _getGreeting(state.currentAssessmentSystem.assessmentSystem, accountQuizSession.score);

        const sharePhrases = {
            ru: 'Я сдал тест "{name}" на {score}%. Мой результат: "{greeting}"',
            uk: 'Я склав тест "{name}" на {score}%. Мій результат: "{greeting}"',
            en: 'I have passed test "{name}" and gained {score}%. My result is: "{greeting}"'
        };

        const title = strformat(sharePhrases[lang], {
            name, score: accountQuizSession.score, greeting: greeting.phrase
        });
        const greetingDescription = greeting.description || '';

        return {
            type        : 'RESULT',
            title,
            siteName    : "It's quiz",
            image       : pictureURL ? pictureURL.replace('svg', 'png') : '',
            description : greetingDescription || message
        };
    }

    if (route === '/share/:key') {
        const { customShareInfo } = clientConfig;
        const { key } = params;

        if (key && customShareInfo && customShareInfo[key]) {
            const { title, pictureURL, description } = customShareInfo[key];

            return {
                type        : 'SHARE',
                title       : strformat(title, query),
                siteName    : 'It\'s quiz',
                image       : pictureURL,
                description : strformat(description, query)
            };
        }
    }

    if (route === '/promo/:key') {
        const { promos } = clientConfig;
        const { key } = params;

        if (key && promos && promos[key]) {
            const { title, image, description } = promos[key];

            return {
                type     : 'PROMO',
                image,
                title,
                description,
                siteName : 'It\'s quiz'
            };
        }
    }

    return {
        type        : 'MAIN',
        title       : 'Quiz Wall',
        siteName    : 'It\'s quiz',
        image       : 'http://app.itsquiz.com/be/static/images/logo.png',
        description : 'Discover tons of different vacancies, tests, quizzes, questionnaires and more...'
    };
}

export function makeRedirectUrl({ originalUrl }) {
    const UIWallPath = `${clientConfig.embedOrigin}/quizwall`;

    return `${UIWallPath}${originalUrl}`;
}

export function getIp(req) {
    return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
}

export function detectLocale(req) {
    // Take locale passed by account
    const passedLocale = (req.query.locale || req.cookies.locale || '').toLowerCase();

    if (getSupportedLocales().indexOf(passedLocale) >= 0) {
        return passedLocale;
    }

    // Detect locale by ip
    const ip = getIp(req);
    const geo = geoip.lookup(ip);
    const country = (geo && geo.country);

    return {
        UA: 'uk',
        RU: 'ru',
        TR: 'tr'
    }[country] || 'en';
}

export function getAssetsPaths() {
    return {
        js:  webpackAssets.main.js,
        css: webpackAssets.main.css
    };
}

function _getGreeting(assessmentSystem, score) {
    for (let i = assessmentSystem.length - 1; i >= 0; i--) {
        if (score >= assessmentSystem[i].grade) {
            return {
                phrase: assessmentSystem[i].phrase,
                description: assessmentSystem[i].description || ''
            };
        }
    }
}
