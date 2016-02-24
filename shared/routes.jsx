import React               from 'react';
import { Route, Redirect } from 'react-router';

import App from './containers/App.jsx';

import MainLayout from './containers/layouts/MainLayout.jsx';

import ActivationsPageContainer       from './containers/pages/ActivationsPage.jsx';
import ActivationPageContainer        from './containers/pages/ActivationPage.jsx';
import ShareResultPageContainer       from './containers/pages/ShareResultPage.jsx';
import CustomShareResultPageContainer from './containers/pages/CustomShareResultPage.jsx';

export default (
    <Route component={App} >
        <Route component={MainLayout} path='/'>
            <Redirect from='/' to='/activations' />
            <Redirect from='/kmda/start' to='/activations?search=english' />

            <Route component={ActivationsPageContainer} path='/activations' />
            <Route component={ActivationPageContainer} path='/activations/:id' />

            <Route component={ShareResultPageContainer} path='/result/:id/:userId' />
            <Route component={CustomShareResultPageContainer} path='/share/:key' />

            <Redirect from='*' to='/activations' />
        </Route>
    </Route>
);
