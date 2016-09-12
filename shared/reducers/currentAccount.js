import {
    LOAD_ACCOUNT_SUCCESS,
    SET_SESSION_TYPE
} from '../actions/accounts';

export default function currentAccount(state = {}, action) {
    // TODO normalize data. in currentAccount save only id. It will allow:
    // 1. Intant account loading from accounts list
    // 2. No accounts blinking while you switch between them. From loaded account to not loaded one.

    switch (action.type) {
        case LOAD_ACCOUNT_SUCCESS:
            return action.account;
        case SET_SESSION_TYPE:
            return {
                ...state,
                isOrganization: action.isOrganization
            };
        default:
            return state;
    }
}
