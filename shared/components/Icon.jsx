import React from 'react';
import cx from 'classnames';

export default ({type, className}) => {
    return (
        <i
            className={cx(`Icon mdi mdi-${type}`, className)}
        />
    );
};
