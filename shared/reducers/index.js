import { combineReducers } from 'redux';

import activations       from './activations';
import currentActivation from './currentActivation';
import users             from './users';
import currentUser       from './currentUser';

const rootReducer = combineReducers({
    activations,
    currentActivation,
    users,
    currentUser
});

export default rootReducer;
