'use strict';

if ( process.env.BROWSER ) {
    require('./Dialog.less');
}

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import ReactModal from 'react-modal';

export default class Dialog extends Component {
    static propTypes = {
        title          : PropTypes.string,
        isOpen         : PropTypes.bool,
        onRequestClose : PropTypes.func
    };

    static defaultProps = {
        className: ''
    };

    render() {
        const { isOpen, title, children, className, onRequestClose } = this.props;

        const styles = {
            overlay : {
                backgroundColor : 'rgba(0, 0, 0, 0.5)'
            },
            content : {
                position : 'static',
                outline  : 'none'
            }
        };

        return (
            <ReactModal
                className      = {cx('Dialog', className)}
                isOpen         = {isOpen}
                style          = {styles}
                onRequestClose = {onRequestClose}>
                    {
                        title
                        ? <h1 className = 'Dialog__title'>{title}</h1>
                        : null
                    }
                    {children}
            </ReactModal>
        );
    }
}
