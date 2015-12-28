import React, { Component, PropTypes } from 'react';
import strformat                       from 'strformat';
import escapeHTML                      from 'lodash/string/escape';

import LoginDialog from '../components/LoginDialog.jsx';

import { socialAuthURL, emailAuthURL } from '../config';

import { sendEvent } from '../utils/googleAnalytics';

export default class LoginDialogContainer extends Component {

    static propTypes = {
        isOpen         : PropTypes.bool.isRequired,
        onRequestClose : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    handleSocialLogin = (type) => {
        const { getLocale } = this.context.i18n;

        const redirectURL = strformat(socialAuthURL, {
            lang: getLocale().toUpperCase(),
            continueRoute: escapeHTML(`/quizwall${window.location.pathname + window.location.search}`),
            socialType: type
        });

        this.openLink(redirectURL);

        sendEvent('user', 'login', type);
    };

    handleEmailLogin = (type) => {
        const { getLocale } = this.context.i18n;

        const redirectURL = strformat(emailAuthURL, {
            lang: getLocale().toLowerCase(),
            continueRoute: escapeHTML(`/quizwall${window.location.pathname}`)
        });

        this.openLink(redirectURL);

        sendEvent('user', 'login', type);
    };

    openLink = (URL) => {
        window.open(URL, '_self');
    };

    render() {
        const { title, isOpen, onRequestClose } = this.props;

        return (
            <LoginDialog
                isOpen         = {isOpen}
                onSocialLogin  = {this.handleSocialLogin}
                onEmailLogin   = {this.handleEmailLogin}
                onRequestClose = {onRequestClose}
            />
        );
    }
}

