'use strict';
import Promise from 'bluebird';

export function fetchComponentsData(dispatch, components, params, query) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;
        return component.fetchData
            ? component.fetchData(dispatch, params, query)
            : null;
    });

    return Promise.all(promises);
}

export function getOGDataFromState({ route, state }) {

    switch (route) {
        case '/:lang/activations/:id':
            const { name, message, pictureURL } = state.currentActivation;
            return {
                title       : name,
                siteName    : 'It\'s quiz',
                image       : pictureURL ? pictureURL.replace('svg', 'png') : '',
                description : message
            };
        default:
            return {
                title       : 'Quiz Wall',
                siteName    : 'It\'s quiz',
                image       : 'http://qas.itsquiz.com/static/images/logo.png',
                description : 'Discover tons of different vacancies, tests, quizzes, questionnaires and more...'
            };
    }
}
