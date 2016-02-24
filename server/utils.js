import Promise     from 'bluebird';
import geoip       from 'geoip-lite';
import strformat   from 'strformat';

import clientConfig                     from '../etc/client-config.json';
import { getSupportedLocales } from '../shared/utils';

export function fetchComponentsData(dispatch, components, params, query) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;

        return component.fetchData
            ? component.fetchData(dispatch, params, query)
            : null;
    });

    return Promise.all(promises);
}

export function getMetaDataFromState({ route, state, lang = 'en', params = {}, query = {} }) {
    if (route === '/activations/:id') {
        const { name, message, pictureURL } = state.currentActivation.activation;

        return {
            title       : name,
            siteName    : "It's quiz",
            image       : pictureURL ? pictureURL.replace('svg', 'png') : '',
            description : message
        };
    }

    if (route === '/result/:id/:userId' && state.currentActivation.activation) {
        const sharePhrases = {
            ru: 'Я сдал тест "{name}" на {score}%',
            uk: 'Я склав тест "{name}" на {score}%',
            en: 'I have passed test "{name}" and gained {score}%'
        };

        const { name, pictureURL, message, userQuizSession } = state.currentActivation.activation;

        return {
            title       : strformat(sharePhrases[lang], { name, score: userQuizSession.score }),
            siteName    : "It's quiz",
            image       : pictureURL ? pictureURL.replace('svg', 'png') : '',
            description : message
        };
    }

    if (route === '/share/:key') {
        const { customShareInfo } = clientConfig;
        const { key } = params;

        if (key && customShareInfo && customShareInfo[key]) {
            const { title, pictureURL, description } = customShareInfo[key];

            return {
                title       : strformat(title, query),
                siteName    : 'It\'s quiz',
                image       : pictureURL,
                description : strformat(description, query)
            };
        }
    }

    return {
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

export function detectLocale(req) {
    // Take locale passed by user
    const passedLocale = ( req.query.locale || req.cookies.locale || '' ).toLowerCase();

    if ( getSupportedLocales().indexOf(passedLocale) >= 0 ) {
        return passedLocale;
    }

    // Detect locale by ip
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const country = ( geo && geo.country );

    return {
        UA: 'uk',
        RU: 'ru'
    }[country] || 'en';
}
