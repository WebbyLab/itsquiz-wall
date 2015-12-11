import React, {Component, PropTypes} from 'react';

import MainLayout from '../../components/layouts/MainLayout.jsx';

import {footerLinks} from '../../config';

export default class MainLayoutContainer extends Component {
    state = {
        isWelcomeScreenShown: false
    };

    componentDidMount() {
        const skipWelcomeScreen = localStorage.getItem('skipWelcomeScreen');
        const { skipWelcomeDialog } = this.props.location.query;

        if (!skipWelcomeScreen && !skipWelcomeDialog) {
            this.setState({ isWelcomeScreenShown: true });
        }
    }

    handleWelcomeScreenDismiss = (needToSkip) => {
        this.setState({ isWelcomeScreenShown: false });

        if (needToSkip) {
            localStorage.setItem('skipWelcomeScreen', 'true');
        }
    };

    render() {
        const { isWelcomeScreenShown } = this.state;
        const isEmbedded = this.props.location.query.embed;

        return (
            <MainLayout
                showWelcomeScreen={!isEmbedded && isWelcomeScreenShown}
                onWelcomeScreenDismiss={this.handleWelcomeScreenDismiss}
                showFooter={!isEmbedded}>
                {this.props.children}
            </MainLayout>
        );
    }
}
