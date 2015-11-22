import React, {Component, PropTypes} from 'react';

import Button from 'react-mdl/lib/Button';

export default ({id, pictureURL, firstName, lastName, country, city, onClick}) => {
    return (
        <div clasName='UserCard'>
            <img src={pictureURL} style={{width: 50, height: 50}}/>
            User {firstName || 'NONAME'} {lastName} from {country} {city}

            <Button colored={true} onClick={onClick}>
                View details
            </Button>
        </div>
    );
};
