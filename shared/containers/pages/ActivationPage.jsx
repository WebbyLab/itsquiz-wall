'use strict';

import React, {Component, PropTypes} from 'react';
import { connect }                   from 'react-redux';
import strformat                     from 'strformat';

import { loadActivation }  from '../../actions/activations';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import EmbedEvents         from '../../utils/EmbedEventsUtil';
import config              from '../../config';
import { sendEvent }       from '../../utils/googleAnalytics';

import ActivationPage from '../../components/pages/ActivationPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class ActivationPageContainer extends Component {
    static contextTypes = { i18n: PropTypes.object };

    state = {
        isSharing : false
    };

    handlePassActivationClick = (activation) => {
        const isEmbedded = this.props.location.query.embed;
        const { linkToPass, actionId } = activation;

        if (isEmbedded) {
            embedEvents.send({
                type : 'PASS_TEST',
                actionId
            });
        } else {
            window.open(linkToPass, '_self');
        }

        sendEvent('activation', 'pass', 'click');
    };

    handleGoBack = () => {
        this.props.history.pushState(null, `/activations`, {
            embed : this.props.location.query.embed
        });
    };

    handleLogin = () => {
        const { getLocale } = this.context.i18n;

        const loginUrl = strformat(config.loginUrl, {
            lang: getLocale()
        });

        sendEvent('user', 'login', 'click');
        window.open(loginUrl, '_self');
    };

    handleActivationClick = (activation) => {
        this.props.history.pushState(null, `/activations/${activation.id}`, {
            embed : this.props.location.query.embed
        });

        sendEvent('activation', 'author activations', 'click');
    };

    handleShare = () => {
        this.setState({
            isSharing : true
        });

        sendEvent('activation', 'share', 'click');
    };

    handleStopSharing = () => {
        this.setState({
            isSharing : false
        });
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.params.id !== nextProps.params.id) {
            this.props.dispatch(loadActivation(nextProps.params, nextProps.location.query) );
        }
    }

    render() {
        return (
            <ActivationPage
                activation        = {this.props.activation}
                authorActivations = {this.props.authorActivations}
                isLoading         = {this.props.isLoading}
                isEmbedded        = {this.props.location.query.embed}
                isSharing         = {this.state.isSharing}
                onPass            = {this.handlePassActivationClick}
                onActivationClick = {this.handleActivationClick}
                onGoBack          = {this.handleGoBack}
                onShare           = {this.handleShare}
                onLogin           = {this.handleLogin}
                onStopSharing     = {this.handleStopSharing}
            />
        );
    }
}

function mapStateToProps({ currentActivation: {activation, authorActivations, isLoading} }) {
    return {
        activation,
        authorActivations,
        isLoading
    };
}

export default connect( mapStateToProps )(
    connectDataFetchers(ActivationPageContainer, [ loadActivation ])
);
