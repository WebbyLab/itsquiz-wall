'use strict';

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import fetch from 'isomorphic-fetch';

import { extractSupportedLocaleFromPathname } from '../shared/utils';
import configureStore from '../shared/store/configureStore';
import routes from '../shared/routes.jsx';
import history from '../shared/history.js';
import i18n from '../shared/i18n';

const initialState = window.__INITIAL_STATE__ || {};
const store = configureStore(initialState);
const locale = extractSupportedLocaleFromPathname(window.location.pathname);

fetch(`/static/lang/${locale}.json`).then( res => {
    if (res.status >= 400) {
        throw new Error('Bad response from server');
    }

    return res.json();
}).then( localeData => {
    const i18nTools = new i18n.Tools({ localeData, locale });

    ReactDOM.render(
        <Provider store={store}>
            <i18n.Provider i18n={i18nTools}>
                <Router children={routes} history={history} />
            </i18n.Provider>
        </Provider>,

        document.getElementById('react-view')
    );
}).catch( error => {
    console.error(error);
});




