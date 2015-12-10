import React, {Component, PropTypes} from 'react';

import MainLayout from '../../components/layouts/MainLayout.jsx';

import {footerLinks} from '../../config';

export default class MainLayoutContainer extends Component {
    state = {
        isWelcomeScreenShown: false
    };

    componentDidMount() {
        const skipWelcomeScreen = localStorage.getItem('skipWelcomeScreen');

        if (!skipWelcomeScreen) {
            this.setState({ isWelcomeScreenShown: true });
        }
    }

    handleWelcomeScreenDismiss = () => {
        localStorage.setItem('skipWelcomeScreen', 'true');
        this.setState({ isWelcomeScreenShown: false });
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
