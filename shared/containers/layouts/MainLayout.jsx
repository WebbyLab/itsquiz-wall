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
        const isEmbedded = this.props.location.query.embed;

        return (
            <MainLayout
                showWelcomeScreen={this.state.isWelcomeScreenShown}
                onWelcomeScreenDismiss={this.handleWelcomeScreenDismiss}
                showFooter={!isEmbedded}
                footerLinks={footerLinks}>
                {this.props.children}
            </MainLayout>
        );
    }
}
