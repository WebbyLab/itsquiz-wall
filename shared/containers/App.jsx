import React, { Component, PropTypes } from 'react';

import EmbedEvents              from '../utils/EmbedEventsUtil';
import config                   from '../config';
import { initialize, navigate } from '../utils/googleAnalytics';
import isIOSDevice              from '../utils/isIOSDevice';

if (process.env.BROWSER) {
    require('../assets');
}

const TIMER_DELAY = 1000;

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

export default class App extends Component {
    static propTypes = {
        location : PropTypes.object,
        routes   : PropTypes.array,
        children : PropTypes.object,
        history  : PropTypes.object
    };

    componentWillMount() {
        this.appContainerHeight = 0;

        clearInterval(this.iframeHeightCalcTimer);
    }

    componentDidMount() {
        initialize();
        navigate({
            page  : this.props.location.pathname,
            title : this.props.routes[this.props.routes.length - 1].path
        });

        embedEvents.subscribe({
            'REDIRECT_QUIZ_WALL' : this.handleRedirect
        });

        if (isIOSDevice()) {
            this.appContainerHeight = this.getContainerHeight();

            this.sendIframeHeightEvent(this.appContainerHeight);
        }
    }

    componentWillReceiveProps(nextProps) {
        const isEmbed = Boolean(this.props.location.query.embed);
        const isPathnameChanged = this.props.location.pathname !== nextProps.location.pathname;
        const isQueryChanged = this.props.location.query !== nextProps.location.query;

        if (isPathnameChanged) {
            navigate({
                page  : nextProps.location.pathname,
                title : nextProps.routes[nextProps.routes.length - 1].path
            });

            this.sendIframeHeightEvent();
        }

        if (isEmbed && (isPathnameChanged || isQueryChanged)) {
            const pathname = nextProps.location.pathname;
            const { category, search } = nextProps.location.query;

            const query = {};

            if (category) {
                query.category = category;
            }

            if (search) {
                query.search = search;
            }

            const quizWallEmbedPath = this.props.history.createHref(pathname, query);

            embedEvents.send({
                type : 'PATH_CHANGED',
                quizWallEmbedPath
            });
        }
    }

    componentDidUpdate() {
        if (isIOSDevice()) {
            const nextHeightOfAppContainer = this.getContainerHeight();

            if (nextHeightOfAppContainer !== this.appContainerHeight) {
                this.sendIframeHeightEvent(nextHeightOfAppContainer);

                this.appContainerHeight = nextHeightOfAppContainer;
            } else {
                this.iframeHeightCalcTimer = setTimeout(() => {
                    const newHeightOfAppContainer = this.getContainerHeight();

                    this.sendIframeHeightEvent(newHeightOfAppContainer);

                    this.appContainerHeight = newHeightOfAppContainer;
                }, TIMER_DELAY);
            }
        }
    }

    componentWillUnmount() {
        this.appContainerHeight = null;
    }

    handleRedirect = () => {
        const newState = {
            embed      : this.props.location.query.embed,
            assigneeId : this.props.location.query.assigneeId
        };

        if (this.props.location.query.search) {
            newState.search = this.props.location.query.search;
        }

        this.props.history.pushState(null, '/activations', newState);
    };

    getContainerHeight = () => {
        return document.getElementById('app-view').scrollHeight;
    };

    sendIframeHeightEvent = (height = 0) => {
        embedEvents.send({
            type         : 'IFRAME_HEIGHT_CALCULATED',
            iframeHeight : height
        });
    }

    render() {
        return (
            <div id='app-view'>
                {this.props.children}
            </div>
        );
    }
}
