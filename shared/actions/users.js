import api                  from '../apiSingleton';
import apiResponseFormatter from '../utils/apiResponseFormatter';

export const LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS';

export function loadUsers() {
    return (dispatch) => {
        return api.users.list().then((response) => {
            // TODO Move formatting to a reducer
            const users = response.data.entities.map(apiResponseFormatter.formatAuthorProfileData);

            dispatch({
                type: LOAD_USERS_SUCCESS,
                users
            });
        });
    };
}

export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAIL    = 'LOAD_USER_FAIL';
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';

export function loadUser({ id }) {
    return (dispatch) => {
        return api.users.show(id).then((response) => {
            const user = apiResponseFormatter.formatAuthorProfileData(response.data);

            dispatch({
                type: LOAD_USER_SUCCESS,
                user
            });
        }).catch(error => {
            dispatch({
                type: LOAD_USER_FAIL,
                error
            });
        });
    };
}
