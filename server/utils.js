'use strict';
import Promise from 'bluebird';
import clientConfig from '../etc/client-config.json';

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
        case '/:lang/activations/:id':
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
    const noLangUrl = originalUrl.replace(/^\/[^\/]+/, '');
    const UIWallPath = `${clientConfig.embedOrigin}/quizwall`;
    return `${UIWallPath}${noLangUrl}`;
}

