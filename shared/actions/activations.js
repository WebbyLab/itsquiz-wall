'use strict';

import api                  from '../apiSingleton';

export const LOAD_ACTIVATIONS_SUCCESS    = 'LOAD_ACTIVATIONS_SUCCESS';
export const LOAD_ACTIVATIONS_FAIL       = 'LOAD_ACTIVATIONS_FAIL';
export const CHANGE_ACTIVATIONS_CATEGORY = 'CHANGE_ACTIVATIONS_CATEGORY';

export function loadActivations(params = {}, query = {}) {
    return (dispatch) => {
        dispatch({
            type      : CHANGE_ACTIVATIONS_CATEGORY,
            category  : query.category
        });

        return api.activations.list({
            include    : 'users',
            search     : query.search || '',
            category   : query.category,
            assigneeId : query.assigneeId || ''
        }).then( ({data, linked} ) => {
            dispatch({
                type        : LOAD_ACTIVATIONS_SUCCESS,
                activations : data.entities,
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

