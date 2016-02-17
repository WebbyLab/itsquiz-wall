'use strict';

import { combineReducers }  from 'redux';
import apiResponseFormatter from '../utils/apiResponseFormatter';

import {
    LOAD_ACTIVATIONS_SUCCESS,
    LOAD_ACTIVATION_REQUEST,
    LOAD_ACTIVATION_SUCCESS,
    LOAD_ACTIVATION_FAIL,
    LOAD_ACTIVATIONS_REQUEST,
    LOAD_NEXT_ACTIVATIONS,
    LOAD_SIMILAR_ACTIVATIONS_REQUEST,
    LOAD_SIMILAR_ACTIVATIONS_SUCCESS,
    LOAD_SIMILAR_ACTIVATIONS_FAIL
} from '../actions/activations';

import {
    LOAD_USERS_SUCCESS,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL
} from '../actions/users';

const DEFAULT_STATE_1 = {
    entitiesByCategory: {},
    totalActivationsAmount: 0,
    isLoadingNextActivations: false,
    isLoading : true,
    category : 'all',
    sortType : 'new'
};

function activations(state = DEFAULT_STATE_1, action) {
    switch (action.type) {
        case LOAD_ACTIVATIONS_SUCCESS: {
            const newActivations = action.activations.map(activation => {
                const author = action.users.find(user => user.id === activation.links.owner.id);
                return apiResponseFormatter.formatActivation(activation, author);
            });

            const loadedActivations = state.entitiesByCategory[action.category]
                ? state.entitiesByCategory[action.category].slice(0)
                : [];

            for (let i = 0; i < newActivations.length; i++) {
                if (action.offset + i < loadedActivations.length) {
                    loadedActivations[action.offset + i] = newActivations[i];
                } else {
                    loadedActivations.push(newActivations[i]);
                }
            }

            const entitiesByCategory = {
                ...entitiesByCategory,
                [action.category]: loadedActivations
            };

            return {
                ...state,
                entitiesByCategory,
                totalActivationsAmount : action.totalAmount,
                search                 : action.search,
                isLoading              : false
            };
        }

        case LOAD_ACTIVATIONS_REQUEST: {
            const isSortTypeChanged = state.sortType !== action.sortType;

            const isLoading = !state.entitiesByCategory[action.category]
                || isSortTypeChanged;

            return {
                ...state,
                isLoading,
                entitiesByCategory : isSortTypeChanged ? {} : state.entitiesByCategory,
                category           : action.category,
                sortType           : action.sortType
            };
        }

        default: {
            return state;
        }
    }
}

const DEFAULT_STATE = { activation : {}, authorActivations: [], similarActications: [], isLoading : true };

function currentActivation(state = DEFAULT_STATE, action) {
    // TODO normalize data. in currentActivation save only id. It will allow:
    // 1. Intant activation loading from activations list
    // 2. No activations blinking while you switch between them. From loaded activation to not loaded one.
    switch (action.type) {
        case LOAD_ACTIVATION_REQUEST:
            return {
                ...state,
                activation : state.activation,
                isLoading : state.activation.id !== action.activationId,
                authorActivations : state.authorActivations
            };

        case LOAD_ACTIVATION_SUCCESS:
            const openedActivation = apiResponseFormatter.formatActivation(action.activation, action.author);

            const otherAuthorActivations = action.authorActivations.filter( authorActivation =>
                authorActivation.id !== openedActivation.id
            );

            const authorActivations = otherAuthorActivations.map( authorActivation =>
                apiResponseFormatter.formatActivation(authorActivation)
            );

            return {
                ...state,
                authorActivations,
                activation : openedActivation,
                isLoading : false
            };

        case LOAD_SIMILAR_ACTIVATIONS_SUCCESS:
            const similarActivations = action.activations.map(activation => {
                const author = action.users.find(user => user.id === activation.links.owner.id);
                return apiResponseFormatter.formatActivation(activation, author);
            });

            return {
                ...state,
                similarActivations
            };

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
