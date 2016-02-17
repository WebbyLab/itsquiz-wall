import {
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL
} from '../actions/users';

export default function currentUser(state = {}, action) {
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
