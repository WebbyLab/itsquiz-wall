import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {loadUser} from '../../actions/users';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import UserPage from '../../components/pages/UserPage.jsx';


class UserPageContainer extends Component {
    render() {
        const user = this.props.user || {};

        return (
            <UserPage user={user} />
        );
    }
}

export default connect( state => ({ user: state.currentUser }) )(
    connectDataFetchers(UserPageContainer, [ loadUser ])
);
