import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

const loggerMiddleware = store => next => action => {
    console.log('prev state', store.getState());

    console.log('action', action);

    const result = next(action);

    console.log('next state', store.getState());

    return result;
};

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware
)(createStore);

export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
