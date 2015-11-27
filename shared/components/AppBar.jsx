'use strict';

import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import SearchBox      from './SearchBox.jsx';
import LanguageSwitch from '../containers/LanguageSwitch.jsx';

import IconButton from 'react-mdl/lib/IconButton';

if ( process.env.BROWSER ) {
    require('./AppBar.less');
}

const LOGO_SRC = '/static/logo.png';

export default class AppBar extends Component {
    static contextTypes = { i18n: PropTypes.object };

    static propTypes = {
        title            : PropTypes.string,
        search           : PropTypes.string,
        displayRightMenu : PropTypes.bool,
        displaySearch    : PropTypes.bool,
        rightIconName    : PropTypes.string,
        fixOnScroll      : PropTypes.bool,
        scrollOffset     : PropTypes.number,
        onRightIconClick : PropTypes.func,
        onSearch         : PropTypes.func
    };

    static defaultProps = {
        title            : '',
        search           : '',
        fixOnScroll      : true,
        displaySearch    : false,
        displayRightMenu : true,
        rightIconName    : '',
        scrollOffset     : 0
    };

    state = {
        isFixedToTop : false
    };

    handleScroll = () => {
        const scrollTop = (window.pageYOffset !== undefined)
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        const isFixedToTop = scrollTop > this.props.scrollOffset;

        if (isFixedToTop !== this.state.isFixedToTop) {
            this.setState({ isFixedToTop });
        }
    };

    componentDidMount() {
        if (this.props.fixOnScroll) {
            window.addEventListener('scroll', this.handleScroll);
        }
    }

    componentWillUnmount() {
        if (this.props.fixOnScroll) {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }

    render() {
        const {
            title,
            search,
            displaySearch,
            displayRightMenu,
            rightIconName,
            onRightIconClick,
            onSearch,
            onLogin
        } = this.props;

        const { l } = this.context.i18n;

        const rootClassNames = cx('AppBar', this.props.className, {
            'AppBar--fixed'       : this.state.isFixedToTop,
            'AppBar--with-search' : displaySearch
        });

        console.log('displayRightMenu', displayRightMenu);

        return (
            <div className={rootClassNames}>
                <div className='AppBar__left'>
                    {
                        rightIconName
                            ? <IconButton name={rightIconName} onClick={onRightIconClick} />
                            : <img width='40px' height='40px' src={LOGO_SRC} className='AppBar__logo'/>
                    }

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

                    {
                        displayRightMenu
                        ?  <div className='AppBar__right'>
                        <LanguageSwitch className='AppBar__lang' />
                            <span className='AppBar__menu-item' onClick={onLogin}>
                                {l('Sign in')}
                            </span>
                        </div>
                        : null
                    }

            </div>
        );
    }
}

