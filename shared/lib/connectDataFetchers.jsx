import React   from 'react';
import Promise from 'bluebird';

export default function connectDataFetchers(Component, actionCreators) {
    return class DataFetchersWrapper extends React.Component {
        static propTypes = {
            dispatch : React.PropTypes.func.isRequired,
            params   : React.PropTypes.object.isRequired,
            location : React.PropTypes.object.isRequired
        };

        static fetchData(dispatch, params = {}, query = {}, lang) {
            return Promise.all(
                actionCreators.map(actionCreator => dispatch(actionCreator({ params, query, lang })))
            );
        }

        componentDidMount() {
            const locale = this.context.i18n ? this.context.i18n.getLocale() : 'en';

            DataFetchersWrapper.fetchData(
                this.props.dispatch,
                this.props.params,
                this.props.location.query,
                locale
            );
        }

        render() {
            return (
                <Component {...this.props} />
            );
        }
    };
}
