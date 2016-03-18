import express      from 'express';
import cookieParser from 'cookie-parser';

import React                     from 'react';
import ReactDOM                  from 'react-dom/server';
import { Provider }              from 'react-redux';
import { RoutingContext, match } from 'react-router';
import escapeHTML                from 'lodash/string/escape';

import { fetchComponentsData,
         getMetaDataFromState,
         makeRedirectUrl,
         detectLocale } from './utils';

import routes         from '../shared/routes.jsx';
import configureStore from '../shared/store/configureStore';
import i18n           from '../shared/i18n';

import clientConfig from '../etc/client-config.json';

// Initializa localization
import ruLocaleData from '../public/static/lang/ru.json';
import ukLocaleData from '../public/static/lang/uk.json';
import enLocaleData from '../public/static/lang/en.json';
import zhcnLocaleData from  '../public/static/lang/zh_cn.json';

const i18nToolsRegistry = {
    ru: new i18n.Tools({ localeData: ruLocaleData, locale: 'ru' }),
    en: new i18n.Tools({ localeData: enLocaleData, locale: 'en' }),
    uk: new i18n.Tools({ localeData: ukLocaleData, locale: 'uk' }),
    zhcn:new i18n.Tools({ localeData: zhcnLocaleData, locale: 'zhcn' })
};

const app = express();

app.use('/static', express.static('public/static'));
app.use(cookieParser());

app.use((req, res) => {
    // Process old links like /en/activations
    if (req.url.match(/\/[a-z]{2}\//i)) {
        const noLangUrl = req.url.replace(/^\/[a-z]{2}/i, '');

        return res.redirect(302, noLangUrl);
    }

    // If user is authenticated redirect him to the wall embedded into the main app
    if (req.cookies.authenticated && !req.url.match('embed')) {
        const redirectUrl = makeRedirectUrl({ originalUrl: req.url });

        return res.redirect(302, redirectUrl);
    }

    const locale = detectLocale(req);
    const store = configureStore();

    const i18nTools = i18nToolsRegistry[locale];

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (req.url === '/') {
            res.redirect(302, '/activations');
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
                const metaData = getMetaDataFromState({
                    params : renderProps.params,
                    query  : renderProps.location.query,
                    lang   : locale,
                    route  : renderProps.routes[renderProps.routes.length - 1].path,
                    state  : initialState
                });

                return renderHTML({
                    componentHTML,
                    initialState,
                    metaData,
                    config : clientConfig
                });
            })
            .then(html => {
                res.cookie('locale', locale, { maxAge: 900000 });
                res.end(html);
            })
            .catch(err => res.end(err.message));
        }
    });
});

function renderHTML({ componentHTML, initialState, metaData, config }) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" href="/static/favicon.ico"/>
            <title>Quiz Wall</title>

            <meta name="description" content="${escapeHTML(metaData.description)}">
            <meta property="og:title" content="${escapeHTML(metaData.title)}" />
            <meta property="og:site_name" content="${escapeHTML(metaData.siteName)}"/>
            <meta property="og:image" content="${escapeHTML(metaData.image)}" />
            <meta property="og:description" content="${escapeHTML(metaData.description)}" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:locale:alternate" content="ru_RU" />
            <meta property="og:locale:alternate" content="uk_UA" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@itsquizcom" />
            <meta name="twitter:title" content="${escapeHTML(metaData.title)}" />
            <meta name="twitter:description" content="${escapeHTML(metaData.description)}" />
            <meta name="twitter:image" content="${escapeHTML(metaData.image)}" />
            <meta property="fb:app_id" content="${escapeHTML(config.facebookAppId)}" />

            <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.cyan-pink.min.css" />
            <link rel="stylesheet" href="//cdn.materialdesignicons.com/1.2.65/css/materialdesignicons.min.css">
            <link rel="stylesheet" href="${config.staticUrl}/static/build/main.css">
            <script src="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js"></script>
            <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            </script>
            <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <!-- Yandex.Metrika counter -->
            <script type="text/javascript">
               (function (d, w, c) {
                   (w[c] = w[c] || []).push(function() {
                       try {
                           w.yaCounter35666924 = new Ya.Metrika({
                               id:35666924,
                               clickmap:true,
                               trackLinks:true,
                               accurateTrackBounce:true
                           });
                       } catch(e) { }
                   });

                   var n = d.getElementsByTagName("script")[0],
                       s = d.createElement("script"),
                       f = function () { n.parentNode.insertBefore(s, n); };
                   s.type = "text/javascript";
                   s.async = true;
                   s.src = "https://mc.yandex.ru/metrika/watch.js";

                   if (w.opera == "[object Opera]") {
                       d.addEventListener("DOMContentLoaded", f, false);
                   } else { f(); }
               })(document, window, "yandex_metrika_callbacks");
            </script>
            <noscript>
                <div>
                    <img src="https://mc.yandex.ru/watch/35666924" style="position:absolute; left:-9999px;" alt="" />
                </div>
            </noscript>
            <!-- /Yandex.Metrika counter -->
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});
