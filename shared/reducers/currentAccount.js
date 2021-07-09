import { SET_SESSION_TYPE, LOAD_ACCOUNT_SUCCESS, CLEAR_CURRENT_ACCOUNT } from '../actions/accounts';
import * as apiResponseFormatter                                         from '../utils/apiResponseFormatter';

const DEFAULT_STATE = {
    isOrganization: false,
    isLoadingAccount : true
};

export default function currentAccount(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_SESSION_TYPE:
            return {
                ...state,
                isOrganization: action.isOrganization
            };
        case LOAD_ACCOUNT_SUCCESS:
            return {
                ...state,
                ...apiResponseFormatter.formatAccountInfo(action.account),
                isLoadingAccount:false
            };
        case CLEAR_CURRENT_ACCOUNT:
            return DEFAULT_STATE;
        default:
            return state;
    }
}
