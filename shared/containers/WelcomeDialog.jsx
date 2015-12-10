import React, {Component, PropTypes} from 'react';
import strformat                     from 'strformat';

import WelcomeDialog from '../components/WelcomeDialog.jsx';

import { welcomeLinks } from '../config';

import { sendEvent } from '../utils/googleAnalytics';

export default class WelcomeDialogContainer extends Component {

    static contextTypes = { i18n: PropTypes.object };

    static propTypes = {
        isOpen         : PropTypes.bool.isRequired,
        onDismiss      : PropTypes.func.isRequired
    };

    handleLearnMoreAboutItsquz = () => {
        window.open(welcomeLinks.aboutItsquiz, '_blank');
    };

    handleDiscoverTests = () => {
        this.props.onDismiss();
    };

    handleCreateTest = () => {
        const { getLocale } = this.context.i18n;
        const linkToOpen = strformat(welcomeLinks.createTest, {
            lang: getLocale()
        });

        window.open(linkToOpen, '_blank');
    };

    render() {
        const { isOpen, onDismiss } = this.props;

        return (
            <WelcomeDialog
                isOpen = {isOpen}
                onLearnMoreAboutItsquiz = {this.handleLearnMoreAboutItsquz}
                onDiscoverTests = {this.handleDiscoverTests}
                onCreateTest = {this.handleCreateTest}
                onDismiss = {onDismiss}
            />
        );
    }
}

