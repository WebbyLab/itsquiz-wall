import React, {Component, PropTypes} from 'react';

if ( process.env.BROWSER ) {
    require('../assets');
}

export default class App extends Component {
    render() {
        return (
            <div id="app-view">
                {this.props.children}
            </div>
        );
    }
}
