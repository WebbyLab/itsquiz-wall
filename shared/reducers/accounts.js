import * as apiResponseFormatter from '../utils/apiResponseFormatter';
import {
    LOAD_ACCOUNTS_SUCCESS,
    LOAD_ACCOUNTS_REQUEST
} from '../actions/accounts';

const DEFAULT_STATE = {
    entitiesByType     : {},
    totalAccountsAmount: 0,
    isLoading          : true,
    viewMode           : 'organization',
    search             : '',
    sortType           : 'new'
};

export default function accounts(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case LOAD_ACCOUNTS_SUCCESS: {
            const newAccounts = action.accounts.map(apiResponseFormatter.formatAccountInfo);

            const loadedAccounts = state.entitiesByType[state.viewMode]
                ? state.entitiesByType[state.viewMode].slice(0)
                : [];

            newAccounts.forEach((newAccount, i) => {
                if (action.offset + i < loadedAccounts.length) {
                    loadedAccounts[action.offset + i] = newAccount;
                } else {
                    loadedAccounts.push(newAccount);
                }
            });

            const entitiesByType = {
                ...entitiesByType,
                [state.viewMode]: loadedAccounts
            };

            return {
                ...state,
                entitiesByType,
                totalAccountsAmount    : action.totalAmount,
                isLoading              : false
            };
        }

        case LOAD_ACCOUNTS_REQUEST: {
            const isSortTypeChanged = state.sortType !== action.sortType;
            const isSearchChanged = state.search !== action.search;

            const isLoading = !state.entitiesByType[action.viewMode]
                || isSortTypeChanged
                || isSearchChanged;

            return {
                ...state,
                isLoading,
                search             : action.search,
                entitiesByType     : isSortTypeChanged || isSearchChanged ? {} : state.entitiesByType,
                viewMode           : action.viewMode,
                sortType           : action.sortType
            };
        }

        default: {
            return state;
        }
    }
}
