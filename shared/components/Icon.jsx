import React, { Component, PropTypes } from 'react';
import cx                              from 'classnames';

if (process.env.BROWSER) {
    require('./Icon.less');
}

export default class Icon extends Component {
    static propTypes = {
        type      : PropTypes.string.isRequired,
        className : PropTypes.string
    };

    render() {
        const { type, className, ...otherProps } = this.props;

        return (
            <div className='Icon'>
                <i
                    {...otherProps}
                    className={cx(`Icon mdi mdi-${type}`, className)}
                />
            </div>
        );
    }
}
