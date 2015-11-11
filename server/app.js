'use strict';

import express from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/server';

import { RoutingContext, match } from 'react-router';

import fetchComponentsData from './fetchComponentsData';

import routes from '../shared/routes.jsx';
import configureStore from '../shared/store/configureStore';
import api from '../shared/apiSingleton';
import i18n from '../shared/i18n';
import { extractSupportedLocaleFromPathname } from '../shared/utils';

import clientConfig from '../etc/client-config.json';

import ruLocaleData from '../public/static/lang/ru.json';
import ukLocaleData from '../public/static/lang/uk.json';
import enLocaleData from '../public/static/lang/en.json';

const i18nToolsRegistry = {
    ru: new i18n.Tools({ localeData: ruLocaleData }),
    en: new i18n.Tools({ localeData: enLocaleData }),
    uk: new i18n.Tools({ localeData: ukLocaleData })
};

const app = express();

app.use('/static', express.static('public/static'));

app.use((req, res) => {
    const store = configureStore();
    const locale = extractSupportedLocaleFromPathname(req.url);

    const i18nTools = i18nToolsRegistry[locale];

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (req.url === '/') {
            res.redirect(302, '/ru/activations');
        }
        if (redirectLocation) {
            res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            res.send(500, error.message);
        } else if (!renderProps) {
            res.send(404, 'Not found');
        } else {
            fetchComponentsData(
                store.dispatch,
                renderProps.components,
                renderProps.params,
                renderProps.location.query
            )
            .then(() => {
                const componentHTML = ReactDOM.renderToString(
                    <Provider store={store}>
                        <i18n.Provider i18n={i18nTools}>
                            <RoutingContext {...renderProps}/>
                        </i18n.Provider>
                    </Provider>
                );

                const initialState = store.getState();
                const title = 'Quiz Wall';

                return renderHTML({
                    componentHTML,
                    title,
                    initialState,
                    config: clientConfig
                });
            })
            .then(html => res.end(html))
            .catch(err => res.end(err.message));
        }
    });
});

function renderHTML({componentHTML, title, initialState, config}) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <script src="https://storage.googleapis.com/code.getmdl.io/1.0.4/material.min.js"></script>
            <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.cyan-pink.min.css" />
            <link rel="stylesheet" href="//cdn.materialdesignicons.com/1.2.65/css/materialdesignicons.min.css">
            <link rel="stylesheet" href="${config.staticUrl}/static/build/main.css">
        </head>
        <body>
        <div id="react-view">${componentHTML}</div>
          <script type="application/javascript">
            window.__CONFIG__ = ${JSON.stringify(config)};
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          </script>

          <script type="application/javascript" src="${config.staticUrl}/static/build/main.js"></script>
        </body>
        </html>
    `;
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server listening on: ' + PORT);
});
