import React, {Component, PropTypes} from 'react';

import IconButton from 'react-mdl/lib/IconButton';

import SearchBox from './SearchBox.jsx';
import AppBar    from './AppBar.jsx';

if ( process.env.BROWSER ) {
    require('./AppBarWithBackground.less');
}

export default class AppBarWithBackground extends Component {
    static propTypes = {
        backgroundURL : PropTypes.string,
        height        : PropTypes.number
    };

    static defaultProps = {
        backgroundURL : '',
        height        : 0
    };

    render() {
        const { backgroundURL, height, onSearch } = this.props;

        const appBarStyle = {
            background: `url(${backgroundURL}) center / cover`
        };

        return (
            <div className='AppBarWithBackground' style={appBarStyle}>
                <AppBar
                    className='AppBarWithBackground__fixed'
                    displaySearch={false}
                    scrollOffset={height / 2}
                    {...this.props}
                />
            </div>
        );
    }
}

