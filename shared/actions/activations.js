'use strict';

import api                  from '../apiSingleton';

export const LOAD_ACTIVATIONS_SUCCESS = 'LOAD_ACTIVATIONS_SUCCESS';
export const LOAD_ACTIVATIONS_FAIL = 'LOAD_ACTIVATIONS_FAIL';

export function loadActivations(params = {}, query = {}) {
    return (dispatch) => {
        return api.activations.list({
            include : 'users',
            search  : query.search || ''
        }).then( ({data, linked} ) => {
            dispatch({
                type        : LOAD_ACTIVATIONS_SUCCESS,
                activations : data.entities,
                search      : query.search,
                users       : linked.users
            });
        });
    };
}

export const LOAD_ACTIVATION_SUCCESS = 'LOAD_ACTIVATION_SUCCESS';
export const LOAD_ACTIVATION_FAIL    = 'LOAD_ACTIVATION_FAIL';
export const LOAD_ACTIVATION_REQUEST = 'LOAD_ACTIVATION_REQUEST';

export function loadActivation({id}) {
    return (dispatch) => {
        return api.activations.show(id).then( (response) => {
            const authorId = response.data.links.owner.id;

            return api.users.show(authorId, {include: 'activations'}).then( (response2) => {
                dispatch({
                    type              : LOAD_ACTIVATION_SUCCESS,
                    activation        : response.data,
                    author            : response2.data,
                    authorActivations : response2.linked.activations
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

