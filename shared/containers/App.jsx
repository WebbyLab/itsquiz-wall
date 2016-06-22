import React, { Component, PropTypes } from 'react';

import bowser from 'bowser';


import EmbedEvents              from '../utils/EmbedEventsUtil';
import config                   from '../config';
import { initialize, navigate } from '../utils/googleAnalytics';

if (process.env.BROWSER) {
    require('../assets');
}

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

        this.appContainerHeight = document.getElementById('app-view').scrollHeight;

        // console.log('appContainerHeight', appContainerHeight);

        embedEvents.send({
            type : 'IFRAME_HEIGHT_CALCULATED',
            iframeHeight: this.appContainerHeight
        });
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


            if (bowser.ios) {
                // Page reload is used here to correctly recalculate height of iframe.
                // It shold be done in componentDidUpdate, but it doesn't work that way
                window.location.reload();
            }

            embedEvents.send({
                type : 'IFRAME_HEIGHT_CALCULATED',
                iframeHeight: null
            });
        }

        if (isEmbed && (isPathnameChanged || isQueryChanged)) {
            const pathname = nextProps.location.pathname;
            const { category } = nextProps.location.query;
            const query = category ? { category } : null;
            const quizWallEmbedPath = this.props.history.createHref(pathname, query);

            embedEvents.send({
                type : 'PATH_CHANGED',
                quizWallEmbedPath
            });
        }
    }

    componentDidUpdate() {
        const nextHeightOfAppContainer = document.getElementById('app-view').scrollHeight;

        if (nextHeightOfAppContainer !== this.appContainerHeight) {
            embedEvents.send({
                type : 'IFRAME_HEIGHT_CALCULATED',
                iframeHeight: nextHeightOfAppContainer
            });

            this.appContainerHeight = nextHeightOfAppContainer;
        }
    }

    componentWillUnmount() {
        this.appContainerHeight = null;
    }

    handleRedirect = () => {
        this.props.history.pushState(null, '/activations', {
            embed      : this.props.location.query.embed,
            assigneeId : this.props.location.query.assigneeId
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
