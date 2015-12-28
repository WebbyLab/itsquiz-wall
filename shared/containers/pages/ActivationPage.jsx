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
        isSharing   : false,
        isLoggingIn : false
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
            this.setState({ isLoggingIn: true });
            this.props.history.pushState(null, this.props.location.pathname, {
                showApplicationDialog: true
            });
        }

        sendEvent('activation', 'pass', 'click');
    };

    handleSponsoredClick = (activation) => {

    };

    handleGoBack = () => {
        this.props.history.pushState(null, `/activations`, {
            embed : this.props.location.query.embed
        });
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

    handleLoginClose = () => {
        this.setState({
            isLoggingIn : false
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
                activation         = {this.props.activation}
                authorActivations  = {this.props.authorActivations}
                isLoading          = {this.props.isLoading}
                isEmbedded         = {this.props.location.query.embed}
                isSharing          = {this.state.isSharing}
                isLoggingIn        = {this.state.isLoggingIn}
                onPass             = {this.handlePassActivationClick}
                onSponsoredClick   = {this.handleSponsoredClick}
                onActivationClick  = {this.handleActivationClick}
                onGoBack           = {this.handleGoBack}
                onShare            = {this.handleShare}
                onStopSharing      = {this.handleStopSharing}
                onLoginDialogClose = {this.handleLoginClose}
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
