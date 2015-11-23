'use strict';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { loadActivations, searchActivations } from '../../actions/activations';
import connectDataFetchers                    from '../../lib/connectDataFetchers.jsx';
import EmbedEvents                            from '../../utils/EmbedEventsUtil';
import config                                 from '../../config';

import ActivationsPage from '../../components/pages/ActivationsPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class ActivationsPageContainer extends Component {
    state = {
        linkToShare : '',
        isSharing   : false
    };

    handleQuizCardClick = (activation) => {
        this.props.history.pushState(null, `/${this.props.params.lang}/activations/${activation.id}`, {
            embed : this.props.location.query.embed
        });
    };

    handleSearch = (searchText) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            search : searchText || undefined
        });
    };

    handleShare = (activation) => {
        this.setState({
            linkToShare : activation.publicLink,
            isSharing   : true
        });
    };

    handleTabChange = (category) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            category : category !== 'ALL' ? category : undefined
        });
    };

    handleStopSharing = () => {
        this.setState({
            linkToShare : '',
            isSharing   : false
        });
    };

    componentDidMount() {
        embedEvents.subscribe({
            'SEARCH_QUIZ_WALL' : this.handleSearch
        });
    }

    componentWillReceiveProps(nextProps) {
        const currentQuery = this.props.location.query;
        const nextQuery = nextProps.location.query;

        const needToReloadData = currentQuery.search !== nextQuery.search
            || currentQuery.category !== nextQuery.category;

        if (needToReloadData) {
            this.props.dispatch( loadActivations(nextProps.params, nextQuery) );
        }
    }

    componentWillUnmount() {
        embedEvents.unsubscribe();
    }

    render() {
        return (
            <ActivationsPage
                activations      = {this.props.activations}
                search           = {this.props.search}
                linkToShare      = {this.state.linkToShare}
                selectedCategory = {this.props.category}
                isSharing        = {this.state.isSharing}
                isEmbedded       = {this.props.location.query.embed}
                isLoading        = {this.props.isLoading}
                onItemClick      = {this.handleQuizCardClick}
                onSearch         = {this.handleSearch}
                onShare          = {this.handleShare}
                onTabChange      = {this.handleTabChange}
                onStopSharing    = {this.handleStopSharing}
            />
        );
    }
}

function mapStateToProps({ activations: {entitiesByCategory, search, category, isLoading} }) {
    return {
        activations : entitiesByCategory[category] || [],
        isLoading,
        search,
        category
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(ActivationsPageContainer, [ loadActivations ])
);

