import React, {Component, PropTypes} from 'react';

export default class MainLayout extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
