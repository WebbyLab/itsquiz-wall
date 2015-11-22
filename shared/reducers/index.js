'use strict';

import { combineReducers } from 'redux';
import apiResponseFormatter from '../utils/apiResponseFormatter';

import {
    LOAD_ACTIVATIONS_SUCCESS,
    LOAD_ACTIVATION_SUCCESS,
    LOAD_ACTIVATION_FAIL,
    CHANGE_ACTIVATIONS_CATEGORY
} from '../actions/activations';

import {
    LOAD_USERS_SUCCESS,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL
} from '../actions/users';


function activations(state = { entitiesByCategory: {} }, action) {
    const handler = {
        [LOAD_ACTIVATIONS_SUCCESS]() {
            const entities = action.activations.map(activation => {
                const author = action.users.find(user => user.id === activation.links.owner.id);
                return apiResponseFormatter.formatActivation(activation, author);
            });

            const entitiesByCategory = { ...state.entitiesByCategory, [action.category]: entities };

            return {
                entitiesByCategory,
                search : action.search,
                category : state.category
            };
        },

        [CHANGE_ACTIVATIONS_CATEGORY]() {
            return {
                entitiesByCategory: state.entitiesByCategory,
                search : state.search,
                category : action.category
            };
        }
    }[action.type];

    return handler ? handler() : state;
}

function currentActivation(state = {}, action) {
    // TODO normalize data. in currentActivation save only id. It will allow:
    // 1. Intant activation loading from activations list
    // 2. No activations blinking while you switch between them. From loaded activation to not loaded one.
    switch (action.type) {
        case LOAD_ACTIVATION_SUCCESS:

            const newState = apiResponseFormatter.formatActivation(action.activation, action.author);

            newState.authorActivations = action.authorActivations.map( authorActivation => {
                return apiResponseFormatter.formatActivation(authorActivation);
            });
            return newState;

        default:
            return state;
    }
}

function users(state = [], action) {
    switch (action.type) {
        case LOAD_USERS_SUCCESS:
            return action.users;
        default:
            return state;
    }
}

function currentUser(state = {}, action) {
    // TODO normalize data. in currentUser save only id. It will allow:
    // 1. Intant user loading from users list
    // 2. No users blinking while you switch between them. From loaded user to not loaded one.

    switch (action.type) {
        case LOAD_USER_SUCCESS:
            return action.user;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    activations,
    currentActivation,
    users,
    currentUser
});

export default rootReducer;
