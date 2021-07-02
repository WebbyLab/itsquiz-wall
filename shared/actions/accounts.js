import api                       from '../apiSingleton';
import { loadAuthorActivations } from './activations';

export const LOAD_ACCOUNTS_SUCCESS = 'LOAD_ACCOUNTS_SUCCESS';
export const LOAD_ACCOUNTS_REQUEST = 'LOAD_ACCOUNTS_REQUEST';
export const CLEAR_CURRENT_ACCOUNT = 'CLEAR_CURRENT_ACCOUNT';

const LIMIT_PER_QUERY = 24;

export function loadAccounts({ query = {}, offset = 0 }) {
    return (dispatch) => {
        dispatch({
            type      : LOAD_ACCOUNTS_REQUEST,
            viewMode  : query.viewMode || 'ORGANIZATION',
            sortType  : query.sortType || 'new',
            search    : query.search || ''
        });

        return api.accounts.list({
            offset,
            hasPublishedActivations: true,
            include                : 'accounts',
            limit                  : LIMIT_PER_QUERY,
            search                 : query.search || '',
            type                   : query.viewMode ? query.viewMode.toUpperCase() : 'ORGANIZATION',
            sortBy                 : query.sortType || ''
        }).then(({ data }) => {
            dispatch({
                offset,
                category    : query.category || 'ALL',
                sortType    : query.sortType || 'new',
                search      : query.search || '',
                type        : LOAD_ACCOUNTS_SUCCESS,
                viewMode    : query.viewMode,
                totalAmount : data.total,
                accounts    : data.entities
            });
        });
    };
}

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';
export const LOAD_ACCOUNT_FAIL    = 'LOAD_ACCOUNT_FAIL';
export const LOAD_ACCOUNT_REQUEST = 'LOAD_ACCOUNT_REQUEST';
export const SET_SESSION_TYPE = 'SET_SESSION_TYPE';

export function loadAccount({ params }) {
    return (dispatch) => {
        return api.accounts.show(params.id).then((response) => {
            const authorActivationsPromise = dispatch(loadAuthorActivations({
                accountId:params.id,
                assigneeId:'',
                openedActivationId: '',
                limit: 8
            }));
            const accountPromise = dispatch({
                type: LOAD_ACCOUNT_SUCCESS,
                account:response.data
            });

            return Promise.all([accountPromise, authorActivationsPromise]);
        }).catch(error => {
            dispatch({
                type: LOAD_ACCOUNT_FAIL,
                error
            });
        });
    };
}

export function loadAccountType({ query }) {
    return (dispatch) => {
        dispatch({
            type: SET_SESSION_TYPE,
            isOrganization: query.isOrganization === 'true'
        });
    };
}

export function clearCurrentAccount() {
    return {
        type: CLEAR_CURRENT_ACCOUNT
    };
}
