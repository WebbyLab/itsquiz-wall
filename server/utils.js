import Promise     from 'bluebird';
import geoip       from 'geoip-lite';
import strformat   from 'strformat';

import clientConfig              from '../etc/client-config.json';
import { getSupportedLocales }   from '../shared/utils';
import standardAssessmentSystems from '../shared/utils/LocaleUtil/assessmentSystems.json';

export function fetchComponentsData(dispatch, components, params, query) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;

        return component.fetchData
            ? component.fetchData(dispatch, params, query)
            : null;
    });

    return Promise.all(promises);
}

export function getMetaDataFromState({ route, state, params = {}, query = {}, lang }) {
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

    if (route === '/result/:id/:userId' && state.currentActivation.activation) {
        const activation = state.currentActivation.activation;
        const { name, pictureURL, message, userQuizSession } = state.currentActivation.activation;
        let greeting;

        if (activation.assessmentSystemType === 'GLOBAL') {
            console.log('GLOBAL');
            const localizedStandardSystems = standardAssessmentSystems[lang.toUpperCase()];

            for (const standardSystemName in localizedStandardSystems) {
                if (localizedStandardSystems[standardSystemName].id === activation.assessmentSystemId) {
                    greeting = _getGreeting(localizedStandardSystems[standardSystemName], userQuizSession.score);
                }
            }
        } else {
            console.log('USER');

            greeting = _getGreeting(state.currentAssessmentSystem.assessmentSystem, userQuizSession.score);
        }

        console.log('greeting', greeting);

        const sharePhrases = {
            ru: 'Я сдал тест "{name}" на {score}%. Мой результат: "{greeting}"',
            uk: 'Я склав тест "{name}" на {score}%. Мій результат: "{greeting}"',
            en: 'I have passed test "{name}" and gained {score}%. My result is: "{greeting}"'
        };

        const title = strformat(sharePhrases[lang], { name, score: userQuizSession.score, greeting: greeting.phrase });
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

export function detectLocale(req) {
    // Take locale passed by user
    const passedLocale = (req.query.locale || req.cookies.locale || '').toLowerCase();

    if (getSupportedLocales().indexOf(passedLocale) >= 0) {
        return passedLocale;
    }

    // Detect locale by ip
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const country = (geo && geo.country);

    return {
        UA: 'uk',
        RU: 'ru',
        TR: 'tr'
    }[country] || 'en';
}

function _getGreeting(assessmentSystem, score) {
    console.log('_getGreeting');
    console.log('assessmentSystem', assessmentSystem);
    console.log('score', score);
    for (let i = assessmentSystem.length - 1; i >= 0; i--) {
        console.log('assessmentSystem[i]', assessmentSystem[i]);
        if (score >= assessmentSystem[i].grade) {
            return {
                phrase: assessmentSystem[i].phrase,
                description: assessmentSystem[i].description || ''
            };
        }
    }
}
