import React, {Component, PropTypes} from 'react';

import { connect } from 'react-redux';

import { loadUsers } from '../../actions/users';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import UsersPage from '../../components/pages/UsersPage.jsx';

class UsersPageContainer extends Component {
    handleUserCardClick = (user) => {
        this.props.history.pushState(null, `/users/${user.id}`);
    };

    render() {
        return (
            <UsersPage
                users       = {this.props.users}
                onItemClick = {this.handleUserCardClick}
            />
        );
    }
}

export default connect( state => ({ users: state.users }) )(
    connectDataFetchers(UsersPageContainer, [ loadUsers ])
);

