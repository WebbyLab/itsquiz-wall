import React from 'react';

export default class Provider extends React.Component {
    static childContextTypes = { i18n: React.PropTypes.object };

    getChildContext() {
        return { i18n: this.props.i18n };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

