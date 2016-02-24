import apiResponseFormatter from '../utils/apiResponseFormatter';

import {
    LOAD_ACTIVATIONS_SUCCESS,
    LOAD_ACTIVATIONS_REQUEST
} from '../actions/activations';

const DEFAULT_STATE = {
    entitiesByCategory: {},
    totalActivationsAmount: 0,
    isLoadingNextActivations: false,
    isLoading : true,
    category : 'all',
    sortType : 'new'
};

export default function activations(state = DEFAULT_STATE, action) {
    console.log('activations', action);
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
                [state.category]: loadedActivations
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
