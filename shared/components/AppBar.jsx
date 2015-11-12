'use strict';

import React from 'react';
import cx from 'classnames';

import $ from 'jquery';
import SearchBox from './SearchBox.jsx';

import IconButton from 'react-mdl/lib/IconButton';

if ( process.env.BROWSER ) {
    require('./AppBar.less');
}

export default class AppBar extends React.Component {
    static propTypes = {
        title            : React.PropTypes.string,
        search           : React.PropTypes.string,
        displaySearch    : React.PropTypes.bool,
        rightIconName    : React.PropTypes.string,
        scrollOffset     : React.PropTypes.number,
        onRightIconClick : React.PropTypes.func,
        onSearch         : React.PropTypes.func
    };

    static defaultProps = {
        title         : '',
        search        : '',
        displaySearch : false,
        rightIconName : 'menu',
        scrollOffset  : 0
    };

    state = {
        isFixedToTop : false
    };

    handleScroll = () => {
        const scrollTop = $(window).scrollTop();
        const isFixedToTop = scrollTop > this.props.scrollOffset;

        if (isFixedToTop !== this.state.isFixedToTop) {
            this.setState({ isFixedToTop });
        }
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const { title, search, displaySearch, rightIconName, onRightIconClick, onSearch } = this.props;

        const rootClassNames = cx('AppBar', this.props.className, {
            'AppBar--fixed'       : this.state.isFixedToTop,
            'AppBar--with-search' : displaySearch
        });

        return (
            <div className={rootClassNames}>
                <div className='AppBar__left'>
                    <IconButton name={rightIconName} onClick={onRightIconClick} />
                    <h2 className='AppBar__title'> {title} </h2>
                </div>
                {
                    displaySearch
                        ? (
                            <div className='AppBar__center'>
                                <SearchBox
                                    className = 'AppBar__search'
                                    search    = {search}
                                    onSearch  = {onSearch}
                                />
                            </div>
                        )
                        : null
                }
            </div>
        );
    }
}

