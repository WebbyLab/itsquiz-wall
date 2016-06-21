import React, { Component, PropTypes } from 'react';

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

    componentDidMount() {
        initialize();
        navigate({
            page  : this.props.location.pathname,
            title : this.props.routes[this.props.routes.length - 1].path
        });

        embedEvents.subscribe({
            'REDIRECT_QUIZ_WALL' : this.handleRedirect
        });

        const appContainerHeight = document.getElementById('app-view').offsetHeight;

        embedEvents.send({
            type : 'IFRAME_HEIGHT_CALCULATED',
            iframeHeight: appContainerHeight
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
