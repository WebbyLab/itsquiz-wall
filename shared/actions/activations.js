import api from '../apiSingleton';

import { loadAssessmentSystem } from './assessmentSystems';

export const LOAD_ACTIVATIONS_SUCCESS    = 'LOAD_ACTIVATIONS_SUCCESS';
export const LOAD_ACTIVATIONS_FAIL       = 'LOAD_ACTIVATIONS_FAIL';
export const LOAD_ACTIVATIONS_REQUEST    = 'LOAD_ACTIVATIONS_REQUEST';

const LIMIT_PER_QUERY = 24;

export function loadActivations({ query = {}, offset = 0 }) {
    return (dispatch) => {
        dispatch({
            type      : LOAD_ACTIVATIONS_REQUEST,
            category  : query.category || 'ALL',
            sortType  : query.sortType || 'new',
            search    : query.search || ''
        });

        return api.activations.list({
            offset,
            include     : 'accounts',
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
                accounts       : linked.accounts
            });
        });
    };
}

export const LOAD_ACTIVATION_REQUEST = 'LOAD_ACTIVATION_REQUEST';
export const LOAD_ACTIVATION_SUCCESS = 'LOAD_ACTIVATION_SUCCESS';
export const LOAD_ACTIVATION_FAIL    = 'LOAD_ACTIVATION_FAIL';

export function loadActivation({ params = {}, query = {}, locale }) {
    const assigneeId = query.assigneeId || params.accountId || '';

    return dispatch => {
        dispatch({ type : LOAD_ACTIVATION_REQUEST, activationId : params.id });

        return api.activations.show(params.id, {
            assigneeId,
            include: 'accounts',
            digest: query.digest,
            accountfromemail: query.accountId
        }).then(response => {
            console.log('_______ RESPONSE_ACT _________', response.data.assigneeQuizSession);
            let assessmentSystemPromise;

            if (assigneeId) {
                assessmentSystemPromise = dispatch(loadAssessmentSystem(response.data, locale));
            }

            const accountId = response.data.links.owner.id;

            const activationPromise = api.activations.list({ accountId, assigneeId }).then(response2 => {
                dispatch({
                    type              : LOAD_ACTIVATION_SUCCESS,
                    activation        : response.data,
                    author            : response.linked.accounts.find(account => account.id === accountId),
                    authorActivations : response2.data.entities
                });
            });

            return Promise.all([assessmentSystemPromise, activationPromise]);
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
    const assigneeId = query.assigneeId || params.accountId || '';
    const similarTo = params.id;

    return dispatch => {
        dispatch({ type : LOAD_SIMILAR_ACTIVATIONS_REQUEST });

        return api.activations.list({
            similarTo, assigneeId, limit: 8, include: 'accounts'
        }).then(({ data, linked }) => {
            dispatch({
                similarTo,
                type         : LOAD_SIMILAR_ACTIVATIONS_SUCCESS,
                accounts        : linked.accounts,
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
