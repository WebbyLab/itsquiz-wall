'use strict';

import React       from 'react';
import { connect } from 'react-redux';

import { loadActivation }  from '../../actions/activations';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import EmbedEvents         from '../../utils/EmbedEventsUtil';
import config              from '../../config';

import ActivationPage from '../../components/pages/ActivationPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class ActivationPageContainer extends React.Component {

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

    componentWillReceiveProps(nextProps) {
        if (this.props.params.id !== nextProps.params.id) {
            this.props.dispatch(loadActivation(nextProps.params, nextProps.location.query) );
        }
    }

    render() {
        const activation = this.props.activation || {};

        return (
            <ActivationPage
                activation        = {activation}
                onPass            = {this.handlePassActivationClick}
                onActivationClick = {this.handleActivationClick}
                onGoBack          = {this.handleGoBack}
            />
        );
    }
}

export default connect( state => ({ activation: state.currentActivation }) )(
    connectDataFetchers(ActivationPageContainer, [ loadActivation ])
);
