import apiResponseFormatter from '../utils/apiResponseFormatter';

import {
    LOAD_ACTIVATION_REQUEST,
    LOAD_ACTIVATION_SUCCESS,
    LOAD_ACTIVATION_FAIL,
    LOAD_SIMILAR_ACTIVATIONS_REQUEST,
    LOAD_SIMILAR_ACTIVATIONS_SUCCESS,
    LOAD_SIMILAR_ACTIVATIONS_FAIL
} from '../actions/activations';

const DEFAULT_STATE = {
    activation : {},
    authorActivations: [],
    similarActications: [],
    isLoading : true
};

export default function currentActivation(state = DEFAULT_STATE, action) {
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
