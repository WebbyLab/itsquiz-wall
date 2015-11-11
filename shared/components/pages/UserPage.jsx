import React from 'react';

import UserCard from '../UserCard.jsx';

export default ({ user }) => {
    return (
        <div>
            <div key={user.id}>
                <img src={user.pictureURL} style={{width: 50, height: 50}}/>
                User {user.firstName || 'NONAME'} {user.lastName} from {user.country} {user.city}
            </div>
        </div>
    );
};
