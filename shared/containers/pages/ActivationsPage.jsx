'use strict';

import React from 'react';

import { connect } from 'react-redux';

import { loadActivations, searchActivations } from '../../actions/activations';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import history from '../../history';

import ActivationsPage from '../../components/pages/ActivationsPage.jsx';

class ActivationsPageContainer extends React.Component {
    handleQuizCardClick = (activation) => {
        this.props.history.pushState(null, `/${this.props.params.lang}/activations/${activation.id}`);
    };

    handleSearch = (searchText) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            search : searchText
        });
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.location.query.search !== nextProps.location.query.search) {
            this.props.dispatch(loadActivations(nextProps.params, nextProps.location.query) );
        }
    }

    render() {
        return (
            <ActivationsPage
                activations = {this.props.activations}
                search      = {this.props.search}
                onItemClick = {this.handleQuizCardClick}
                onSearch    = {this.handleSearch}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        activations : state.activations.entities || [],
        search      : state.activations.search
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(ActivationsPageContainer, [ loadActivations ])
);

