import React, { Component, PropTypes } from 'react';

import AppBar    from './AppBar.jsx';

if (process.env.BROWSER) {
    require('./AppBarWithBackground.less');
}

export default class AppBarWithBackground extends Component {
    static propTypes = {
        backgroundURL : PropTypes.string,
        height        : PropTypes.number,
        onLogin       : PropTypes.func
    };

    static defaultProps = {
        backgroundURL : '',
        height        : 0
    };

    render() {
        const { backgroundURL, height, onLogin } = this.props;

        const appBarStyle = {
            background: `url(${backgroundURL}) center / cover`
        };

        return (
            <div className='AppBarWithBackground' style={appBarStyle}>
                <AppBar
                    className='AppBarWithBackground__fixed'
                    displaySearch={false}
                    scrollOffset={height / 2}
                    onLogin={onLogin}
                    {...this.props}
                />
            </div>
        );
    }
}

