import api from '../apiSingleton';

import { loadAssessmentSystem } from './assessmentSystems';

export const LOAD_ACTIVATIONS_SUCCESS    = 'LOAD_ACTIVATIONS_SUCCESS';
export const LOAD_ACTIVATIONS_FAIL       = 'LOAD_ACTIVATIONS_FAIL';
export const LOAD_ACTIVATIONS_REQUEST    = 'LOAD_ACTIVATIONS_REQUEST';

const LIMIT_PER_QUERY = 24;

export function loadActivations({ params = {}, query = {} }, offset = 0) {
    return (dispatch) => {
        dispatch({
            type      : LOAD_ACTIVATIONS_REQUEST,
            category  : query.category || 'ALL',
            sortType  : query.sortType || 'new',
            search    : query.search || ''
        });

        return api.activations.list({
            offset,
            include     : 'users',
            limit       : LIMIT_PER_QUERY,
            search      : query.search || '',
            category    : query.category !== 'SPECIAL' ? query.category : '',
            isSponsored : query.category === 'SPECIAL' ? true : '',
            sortBy      : query.sortType || '',
            assigneeId  : query.assigneeId || ''

        }).then(({ data, linked }) => {
            dispatch({
                offset,
                category    : query.category || 'ALL',
                sortType    : query.sortType || 'new',
                search      : query.search || '',
                type        : LOAD_ACTIVATIONS_SUCCESS,
                activations : data.entities,
                totalAmount : data.total,
                users       : linked.users
            });
        });
    };
}

export const LOAD_ACTIVATION_REQUEST = 'LOAD_ACTIVATION_REQUEST';
export const LOAD_ACTIVATION_SUCCESS = 'LOAD_ACTIVATION_SUCCESS';
export const LOAD_ACTIVATION_FAIL    = 'LOAD_ACTIVATION_FAIL';

export function loadActivation({ params = {}, query = {}, locale }) {
    const assigneeId = query.assigneeId || params.userId || '';

    console.log('params', params);

    return dispatch => {
        dispatch({ type : LOAD_ACTIVATION_REQUEST, activationId : params.id });

        return api.activations.show(params.id, {
            assigneeId,
            include: 'users',
            digest: query.digest,
            userfromemail: query.userId
        }).then(response => {
            console.log('response.data', response.data);

            // if (response.data.assigneeQuizSession.finishedAt && assigneeId) {
            const assessmentSystemPromise = loadAssessmentSystem(response.data, locale)(dispatch);
            // }

            // console.log('assessmentSystemPromise', assessmentSystemPromise);

            const userId = response.data.links.owner.id;

            const activationPromise = api.activations.list({ userId, assigneeId }).then(response2 => {
                dispatch({
                    type              : LOAD_ACTIVATION_SUCCESS,
                    activation        : response.data,
                    author            : response.linked.users.find(user => user.id === userId),
                    authorActivations : response2.data.entities
                });
            });

            return Promise.all(assessmentSystemPromise, activationPromise);
        }).catch(error => {
            dispatch({
                type: LOAD_ACTIVATION_FAIL,
                error
            });
        });
    };
}

export const LOAD_SIMILAR_ACTIVATIONS_REQUEST = 'LOAD_SIMILAR_ACTIVATIONS_REQUEST';
export const LOAD_SIMILAR_ACTIVATIONS_SUCCESS = 'LOAD_SIMILAR_ACTIVATIONS_SUCCESS';
export const LOAD_SIMILAR_ACTIVATIONS_FAIL    = 'LOAD_SIMILAR_ACTIVATIONS_FAIL';

export function loadSimilarActivations({ params = {}, query = {} }) {
    const assigneeId = query.assigneeId || params.userId || '';
    const similarTo = params.id;

    return dispatch => {
        dispatch({ type : LOAD_SIMILAR_ACTIVATIONS_REQUEST });

        return api.activations.list({ similarTo, assigneeId, limit: 8, include: 'users' }).then(({ data, linked }) => {
            dispatch({
                similarTo,
                type         : LOAD_SIMILAR_ACTIVATIONS_SUCCESS,
                users        : linked.users,
                activations  : data.entities
            });
        }).catch(error => {
            dispatch({
                type: LOAD_SIMILAR_ACTIVATIONS_FAIL,
                error
            });
        });
    };
}
