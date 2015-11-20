'use strict';

import React       from 'react';
import { connect } from 'react-redux';

import { loadActivations, searchActivations } from '../../actions/activations';
import connectDataFetchers                    from '../../lib/connectDataFetchers.jsx';
import history                                from '../../history';
import EmbedEvents                            from '../../utils/EmbedEventsUtil';
import config                                 from '../../config';

import ActivationsPage from '../../components/pages/ActivationsPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class ActivationsPageContainer extends React.Component {

    state = {
        linkToShare : '',
        isSharing   : false
    };

    componentDidMount() {
        embedEvents.subscribe({
            'SEARCH_QUIZ_WALL' : this.handleSearch
        });
    }

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
        console.log(this.state)
        return (
            <ActivationsPage
                activations      = {this.props.activations}
                search           = {this.props.search}
                linkToShare      = {this.state.linkToShare}
                isSharing        = {this.state.isSharing}
                selectedCategory = {this.props.category}
                isEmbedded       = {this.props.location.query.embed}
                onItemClick      = {this.handleQuizCardClick}
                onSearch         = {this.handleSearch}
                onShare          = {this.handleShare}
                onTabChange      = {this.handleTabChange}
                onStopSharing    = {this.handleStopSharing}
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

