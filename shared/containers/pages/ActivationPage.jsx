'use strict';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { loadActivation }  from '../../actions/activations';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import EmbedEvents         from '../../utils/EmbedEventsUtil';
import config              from '../../config';

import ActivationPage from '../../components/pages/ActivationPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class ActivationPageContainer extends Component {
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
    };

    handleGoBack = () => {
        this.props.history.pushState(null, `/${this.props.params.lang}/activations`, {
            embed : this.props.location.query.embed
        });
    };

    handleActivationClick = (activation) => {
        this.props.history.pushState(null, `/${this.props.params.lang}/activations/${activation.id}`, {
            embed : this.props.location.query.embed
        });
    };

    handleShare = () => {
        this.setState({
            isSharing : true
        });
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
                activation        = {this.props.activation || {}}
                isSharing         = {this.state.isSharing}
                onPass            = {this.handlePassActivationClick}
                onActivationClick = {this.handleActivationClick}
                onGoBack          = {this.handleGoBack}
                onShare           = {this.handleShare}
                onStopSharing     = {this.handleStopSharing}
            />
        );
    }
}

export default connect( state => ({ activation: state.currentActivation }) )(
    connectDataFetchers(ActivationPageContainer, [ loadActivation ])
);
