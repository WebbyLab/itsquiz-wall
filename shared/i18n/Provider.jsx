import React from 'react';
import PropTypes from 'prop-types';

export default class Provider extends React.Component {
    static propTypes = {
        i18n     : PropTypes.object.isRequired,
        children : PropTypes.object.isRequired
    };

    static childContextTypes = { i18n: PropTypes.object };

    getChildContext() {
        return { i18n: this.props.i18n };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
