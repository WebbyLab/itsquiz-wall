import React, { Component, PropTypes }      from 'react';
import { connect }                          from 'react-redux';

import {
    loadAuthorActivations
}                                           from '../../actions/activations';
import { loadAccount, clearCurrentAccount } from '../../actions/accounts';
import connectDataFetchers                  from '../../lib/connectDataFetchers.jsx';
import { sendEvent }                        from '../../utils/googleAnalytics';
import { makeSlug }                         from '../../utils/urlUtil';
import AccountPage                          from '../../components/pages/AccountPage.jsx';
import EmbedEvents                          from '../../utils/EmbedEventsUtil';
import config                               from '../../config';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class AccountPageContainer extends Component {
    static propTypes = {
        history                     : PropTypes.object,
        location                    : PropTypes.object,
        params                      : PropTypes.object,
        isLoading                   : PropTypes.bool,
        dispatch                    : PropTypes.func,
        account                     : PropTypes.object,
        isLoadingAuthorActivations  : PropTypes.bool,
        isAllAuthorActivationsLoaded: PropTypes.bool,
        authorActivations           : PropTypes.array
    };

    static contextTypes = { i18n: PropTypes.object };

    state = {
        linkToShare : '',
        isSharing   : false,
        isLoggingIn : false
    };

    componentWillMount() {
        const { id, accountId } = this.props.params;

        if (accountId) {
            this.props.history.replaceState(null, `/account/${id}`);
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearCurrentAccount());
    }

    handleStopSharing = () => {
        this.setState({
            linkToShare : '',
            isSharing   : false
        });
    };

    handleShare = (activation) => {
        this.setState({
            linkToShare : activation.publicLink,
            isSharing   : true
        });

        sendEvent('activation card', 'share', activation.name);
    };

    handleGoBack = () => {
        window.history.back();
    };

    handleLoadAllAuthorActivations = (accountId) => () => {
        this.props.dispatch(loadAuthorActivations({ accountId, isAllActivationsLoaded: true }));
    };

    handleActivationClick = (activation) => {
        this.props.history.pushState(null, `/activations/${activation.id}/${makeSlug(activation.name)}`, {
            embed : this.props.location.query.embed,
            assigneeId : this.props.location.query.assigneeId
        });

        sendEvent('activation', 'author activation view');
    };

    handleAuthorAvatarClick = (authorId) => {
        const isEmbedded = this.props.location.query.embed;

        if (isEmbedded) {
            embedEvents.send({
                authorId,
                type : 'VIEW_AUTHOR_PROFILE'
            });
        } else {
            this.setState({ isLoggingIn: true });
        }
    };

    handleLoginClose = () => {
        this.setState({
            isLoggingIn : false
        });
    };

    render() {
        const {
            account,
            authorActivations,
            isLoading,
            isAllAuthorActivationsLoaded,
            isLoadingAuthorActivations
        } = this.props;

        const { embed } = this.props.location.query;

        return (
            <AccountPage
                account                      = {account}
                authorActivations            = {authorActivations}
                isLoading                    = {isLoading}
                isLoadingAuthorActivations   = {isLoadingAuthorActivations}
                isAllAuthorActivationsLoaded = {isAllAuthorActivationsLoaded}
                isSharing                    = {this.state.isSharing}
                linkToShare                  = {this.state.linkToShare}
                isLoggingIn                  = {this.state.isLoggingIn}
                isEmbedded                   = {Boolean(embed)}
                onActivationClick            = {this.handleActivationClick}
                onGoBack                     = {this.handleGoBack}
                onLoadAllAuthorActivations   = {this.handleLoadAllAuthorActivations}
                onStopSharing                = {this.handleStopSharing}
                onShare                      = {this.handleShare}
                onAuthorAvatarClick          = {this.handleAuthorAvatarClick}
                onLoginClose                 = {this.handleLoginClose}
            />
        );
    }
}

function mapStateToProps({
    currentAccount,
    currentActivation : {
        isLoadingAuthorActivations,
        isAllAuthorActivationsLoaded,
        authorActivations
    }
}) {
    return {
        account  : currentAccount,
        isLoading: currentAccount.isLoadingAccount,
        isLoadingAuthorActivations,
        isAllAuthorActivationsLoaded,
        authorActivations
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(AccountPageContainer, [ loadAccount ])
);
