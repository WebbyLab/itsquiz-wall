'use strict';

import React, {Component, PropTypes} from 'react';
import { connect }                   from 'react-redux';
import strformat                     from 'strformat';
import debounce                      from 'lodash/function/debounce';

import { loadActivations, searchActivations } from '../../actions/activations';
import connectDataFetchers                    from '../../lib/connectDataFetchers.jsx';
import EmbedEvents                            from '../../utils/EmbedEventsUtil';
import config                                 from '../../config';
import { sendEvent }                          from '../../utils/googleAnalytics';

import ActivationsPage from '../../components/pages/ActivationsPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class ActivationsPageContainer extends Component {
    static contextTypes = { i18n: PropTypes.object };

    state = {
        linkToShare : '',
        isSharing   : false,
        isLoggingIn : false
    };

    constructor() {
        super();

        this.handleItemRenderRequest = debounce(this.handleItemRenderRequest, 50, {
            leading  : true,
            trailing : false
        });
    }

    handleQuizCardClick = (activation) => {
        this.props.history.pushState(null, `/activations/${activation.id}`, {
            embed : this.props.location.query.embed,
            assigneeId : this.props.location.query.assigneeId
        });

        sendEvent('activation card', 'view details', activation.name);
    };

    handleSearch = (searchText) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            search : searchText || undefined
        });

        sendEvent('activations page', 'search');
    };

    handleShare = (activation) => {
        this.setState({
            linkToShare : activation.publicLink,
            isSharing   : true
        });

        sendEvent('activation card', 'share', activation.name);
    };

    handleSpecialsSubscribe = () => {
        this.setState({
            isLoggingIn : true
        });

        sendEvent('specials subscribe', 'click');

        if (!localStorage.getItem('ref')) {
            localStorage.setItem('ref', 'new_offers');
        }
    };

    handleLoginClose = () => {
        this.setState({
            isLoggingIn : false
        });
    };

    handleTabChange = (category) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            category : category !== 'ALL' ? category : undefined
        });

        sendEvent('activations page', 'category change', category);
    };

    handleStopSharing = () => {
        this.setState({
            linkToShare : '',
            isSharing   : false
        });
    };

    handleItemRenderRequest = (index) => {
        const { activations, totalActivationsAmount } = this.props;

        if (index + 30 < totalActivationsAmount && index + 30 >= activations.length) {
            console.log('load', activations.length);
            this.props.dispatch( loadActivations(this.props.params, this.props.location.query, activations.length) );
        }
    };

    componentDidMount() {
        embedEvents.subscribe({
            'SEARCH_QUIZ_WALL' : this.handleSearch
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');

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
                activations            = {this.props.activations}
                totalActivationsAmount = {this.props.totalActivationsAmount}
                search                 = {this.props.search}
                linkToShare            = {this.state.linkToShare}
                selectedCategory       = {this.props.category}
                isSharing              = {this.state.isSharing}
                isLoggingIn            = {this.state.isLoggingIn}
                isEmbedded             = {this.props.location.query.embed}
                isLoading              = {this.props.isLoading}
                isEmpty                = {this.props.activations.length === 0}
                onItemClick            = {this.handleQuizCardClick}
                onSearch               = {this.handleSearch}
                onShare                = {this.handleShare}
                onLoginClose           = {this.handleLoginClose}
                onSpecialsSubscribe    = {this.handleSpecialsSubscribe}
                onTabChange            = {this.handleTabChange}
                onItemRenderRequest    = {this.handleItemRenderRequest}
                onStopSharing          = {this.handleStopSharing}
            />
        );
    }
}

function mapStateToProps({ activations: { entitiesByCategory, search, category, isLoading, totalActivationsAmount } }) {
    const activations = entitiesByCategory[category] || [];

    return {
        totalActivationsAmount,
        isLoading,
        search,
        category,
        activations
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(ActivationsPageContainer, [ loadActivations ])
);

