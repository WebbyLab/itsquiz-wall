'use strict';

import api from '../apiSingleton';

export const LOAD_ACTIVATIONS_SUCCESS    = 'LOAD_ACTIVATIONS_SUCCESS';
export const LOAD_ACTIVATIONS_FAIL       = 'LOAD_ACTIVATIONS_FAIL';
export const CHANGE_ACTIVATIONS_CATEGORY = 'CHANGE_ACTIVATIONS_CATEGORY';
export const LOAD_NEXT_ACTIVATIONS       = 'LOAD_NEXT_ACTIVATIONS';

const LIMIT_PER_QUERY = 60;

export function loadActivations(params = {}, query = {}, offset = 0) {
    return (dispatch) => {
        dispatch({
            type      : CHANGE_ACTIVATIONS_CATEGORY,
            category  : query.category
        });

        console.log('offset', offset);

        return api.activations.list({
            offset,
            include     : 'users',
            limit       : LIMIT_PER_QUERY,
            search      : query.search || '',
            category    : query.category !== 'SPECIAL' ? query.category : '',
            isSponsored : query.category === 'SPECIAL' ? true : '',
            assigneeId  : query.assigneeId || ''
        }).then( ({ data, linked } ) => {
            dispatch({
                offset,
                type        : LOAD_ACTIVATIONS_SUCCESS,
                activations : data.entities,
                totalAmount : data.total,
                search      : query.search,
                category    : query.category,
                users       : linked.users
            });
        });
    };
}

export const LOAD_ACTIVATION_REQUEST = 'LOAD_ACTIVATION_REQUEST';
export const LOAD_ACTIVATION_SUCCESS = 'LOAD_ACTIVATION_SUCCESS';
export const LOAD_ACTIVATION_FAIL    = 'LOAD_ACTIVATION_FAIL';

export function loadActivation(params = {}, query = {}) {
    const assigneeId = query.assigneeId || params.userId || '';

    return dispatch => {
        dispatch({ type : LOAD_ACTIVATION_REQUEST, activationId : params.id });

        return api.activations.show(params.id, { assigneeId, include: 'users' }).then( response => {
            const userId = response.data.links.owner.id;

            return api.activations.list({ userId, assigneeId }).then( response2 => {
                dispatch({
                    type              : LOAD_ACTIVATION_SUCCESS,
                    activation        : response.data,
                    author            : response.linked.users.find(user => user.id === userId),
                    authorActivations : response2.data.entities
                });
            });
        }).catch( error => {
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

export function loadSimilarActivations(params = {}, query = {}) {
    const assigneeId = query.assigneeId || params.userId || '';
    const similarTo = params.id;


    return dispatch => {
        dispatch({ type : LOAD_SIMILAR_ACTIVATIONS_REQUEST });

        return api.activations.list({ similarTo, assigneeId, limit: 8, include: 'users' }).then( ({ data, linked }) => {
            dispatch({
                similarTo,
                type         : LOAD_SIMILAR_ACTIVATIONS_SUCCESS,
                users        : linked.users,
                activations  : data.entities
            });
        }).catch( error => {
            dispatch({
                type: LOAD_SIMILAR_ACTIVATIONS_FAIL,
                error
            });
        });
    };
}

