import React, { Component, PropTypes } from 'react';

import cx from 'classnames';

import { getIconClassName } from '../../utils/iconClassNames';

class Icon extends Component {

    static propTypes = {
        type      : PropTypes.string,
        size      : PropTypes.number,
        style     : PropTypes.object,
        className : PropTypes.string
    };

    static defaultProps = {
        size: 24
    };

    render() {
        const {
            type,
            size,
            style,
            className
        } = this.props;

        const classes = cx('Icon', getIconClassName(type), className);

        const iconStyle = {
            fontSize: size,
            ...style
        };

        return (
            <i
                {...this.props}
                className={classes}
                style={iconStyle}
                data-type='icon'
            />
        );
    }
}

export default Icon;
