import React from 'react';
import cx from 'classnames';

export default (props) => {
    return (
        <i
            {...props}
            className={cx(`Icon mdi mdi-${props.type}`, props.className)}
        />
    );
};
