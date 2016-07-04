import React    from 'react';
import ReactDOM from 'react-dom/server';

import i18n         from '../shared/i18n';
import clientConfig from '../shared/config';

import NotFoundPage from '../shared/containers/pages/NotFoundPage.jsx';

export default function send404(res, i18nTools) {
    const componentHTML = ReactDOM.renderToString(
        <i18n.Provider i18n={i18nTools}>
            <NotFoundPage />
        </i18n.Provider>
    );

    const html = render404HTML({
        componentHTML,
        config : clientConfig
    });

    res.status(404).send(html);
}

function render404HTML({ componentHTML, config }) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" href="/static/favicon.ico"/>
            <title>Quiz Wall - itsquiz.com</title>
            <meta name="description" content="404 Page not found">
            <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.cyan-pink.min.css" />
            <link rel="stylesheet" href="//cdn.materialdesignicons.com/1.2.65/css/materialdesignicons.min.css">
            <link rel="stylesheet" href="${config.staticUrl}/static/notFoundPageStyles/main.css">
            <script src="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js"></script>
        </head>
        <body>
            <div id="react-view">${componentHTML}</div>
        </body>
        </html>
    `;
}
