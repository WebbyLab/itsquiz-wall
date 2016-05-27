import React, { PropTypes } from 'react';
import Promise from 'bluebird';

export default function connectDataFetchers(Component, actionCreators) {
    return class DataFetchersWrapper extends React.Component {
        static contextTypes = { i18n: PropTypes.object };

        static propTypes = {
            dispatch : React.PropTypes.func.isRequired,
            params   : React.PropTypes.object.isRequired,
            location : React.PropTypes.object.isRequired
        };

        static fetchData({ dispatch, params = {}, query = {}, locale }) {
            return Promise.all(
                actionCreators.map(actionCreator => dispatch(actionCreator({ params, query, locale })))
            );
        }

        componentDidMount() {
            const locale = this.context.i18n ? this.context.i18n.getLocale() : 'en';

            DataFetchersWrapper.fetchData({
                locale,
                dispatch : this.props.dispatch,
                params   : this.props.params,
                query    : this.props.location.query
            });
        }

        render() {
            return (
                <Component {...this.props} />
            );
        }
    };
}
