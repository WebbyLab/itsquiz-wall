import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import ReactModal from 'react-modal';

if (process.env.BROWSER) {
    require('./Dialog.less');
}

export default class Dialog extends Component {
    static propTypes = {
        title          : PropTypes.string,
        isOpen         : PropTypes.bool,
        children       : PropTypes.any,
        className      : PropTypes.string,
        onRequestClose : PropTypes.func
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

        const classes = cx('Dialog', className);

        return (
            <ReactModal
                className      = {classes}
                isOpen         = {isOpen}
                style          = {styles}
                onRequestClose = {onRequestClose}
            >
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
