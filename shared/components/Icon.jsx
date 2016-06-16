import React, { Component, PropTypes } from 'react';
import cx                              from 'classnames';

export default class Icon extends Component {
    static propTypes = {
        type : PropTypes.string.isRequired,
        mode : PropTypes.oneOf(['on', 'off'])
    };

    render() {
        const { type, mode, ...otherProps } = this.props;

        const classes = {
            on  : 'Icon-on',
            off : 'Icon-off'
        };

        return (
            <div className='Icon'>
                <i
                    {...otherProps}
                    className={cx(`Icon mdi mdi-${type}`, classes[mode])}
                />
            </div>
        );
    }
}
