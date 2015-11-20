'use strict';

if ( process.env.BROWSER ) {
    require('./Dialog.less');
}

import React      from 'react';
import ReactModal from 'react-modal';

export default class Dialog extends React.Component {

    static propTypes = {
        title          : React.PropTypes.string,
        isOpen         : React.PropTypes.bool,
        onRequestClose : React.PropTypes.func
    };

    static defaultProps = {
        className: ''
    };

    render() {
        const { isOpen, title, children, onRequestClose } = this.props;

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
                className      = 'Dialog'
                isOpen         = {isOpen}
                style          = {styles}
                onRequestClose = {onRequestClose}>
                <h1 className = 'Dialog__title'>
                    {title}
                </h1>
                <div className = 'Dialog__body'>
                    {children}
                </div>
            </ReactModal>
        );
    }
}
