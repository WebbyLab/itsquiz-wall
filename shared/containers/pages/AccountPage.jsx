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

    componentWillMount() {
        const { id, accountId } = this.props.params;

        if (accountId) {
            this.props.history.replaceState(null, `/account/${id}`);
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearCurrentAccount());
    }

    handleGoBack = () => {
        window.history.back();
    };

    handleLoadAllAuthorActivations = (accountId) => () => {
        this.props.dispatch(loadAuthorActivations({ accountId, isAllActivationsLoaded: true }));
    };

    handleActivationClick = (activation) => {
        this.props.history.pushState(null, `/activations/${activation.id}/${makeSlug(activation.name)}`);

        sendEvent('activation', 'author activation view');
    };

    render() {
        const {
            account,
            authorActivations,
            isLoading,
            isAllAuthorActivationsLoaded,
            isLoadingAuthorActivations
        } = this.props;

        return (
            <AccountPage
                account                      = {account}
                authorActivations            = {authorActivations}
                isLoading                    = {isLoading}
                isLoadingAuthorActivations   = {isLoadingAuthorActivations}
                isAllAuthorActivationsLoaded = {isAllAuthorActivationsLoaded}
                onActivationClick            = {this.handleActivationClick}
                onGoBack                     = {this.handleGoBack}
                onLoadAllAuthorActivations   = {this.handleLoadAllAuthorActivations}
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
