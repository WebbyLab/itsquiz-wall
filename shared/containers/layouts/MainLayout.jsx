import React, {Component, PropTypes} from 'react';

import Textfield from 'react-mdl/lib/Textfield';
import history   from '../../history';

export default class MainLayout extends Component {
    state = {
        search: ''
    };

    handleSearch(event) {
        const searchStr = event.target.value();
        this.setState({search: searchStr});
    }

    handleTabClick(type) {
        history.pushState(null, `/${type}`);
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
