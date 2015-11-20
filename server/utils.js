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

    switch(route) {
        case '/:lang/activations/:id':
            return {
                title       : state.currentActivation.name,
                siteName    : 'It\'s quiz',
                image       : state.currentActivation.pictureURL,
                description : state.currentActivation.message
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
