'use strict';

import React from 'react';

import { connect } from 'react-redux';

import { loadActivations, searchActivations } from '../../actions/activations';
import connectDataFetchers                    from '../../lib/connectDataFetchers.jsx';
import history                                from '../../history';

import ActivationsPage from '../../components/pages/ActivationsPage.jsx';

import { ACTIVATION_CATEGORIES } from '../../constants';

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

    handleTabChange = (category) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            category : ACTIVATION_CATEGORIES[category]
        });
    };

    componentWillReceiveProps(nextProps) {
        const currentQuery = this.props.location.query;
        const nextQuery = nextProps.location.query;

        const needToReloadData = currentQuery.search !== nextQuery.search
            || currentQuery.category !== nextQuery.category;

        if (needToReloadData) {
            this.props.dispatch( loadActivations(nextProps.params, nextQuery) );
        }
    }

    render() {
        return (
            <ActivationsPage
                activations      = {this.props.activations}
                search           = {this.props.search}
                selectedCategory = {this.props.category}
                onItemClick      = {this.handleQuizCardClick}
                onSearch         = {this.handleSearch}
                onTabChange      = {this.handleTabChange}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        activations : state.activations.entities || [],
        search      : state.activations.search,
        category    : state.activations.category
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(ActivationsPageContainer, [ loadActivations ])
);

