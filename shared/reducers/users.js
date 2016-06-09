import {
    LOAD_USERS_SUCCESS
} from '../actions/users';

export default function users(state = [], action) {
    switch (action.type) {
        case LOAD_USERS_SUCCESS:
            return action.users;
        default:
            return state;
    }
}
