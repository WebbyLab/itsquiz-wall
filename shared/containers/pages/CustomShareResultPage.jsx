'use strict';

import React, { Component, PropTypes } from 'react';
import strformat                       from 'strformat';

import BasicSharePage from '../../components/pages/BasicSharePage.jsx';

import { customShareInfo } from '../../config';

class CustomShareResultPageContainer extends Component {
    componentDidMount() {
        const { key } = this.props.params;

        if (customShareInfo && customShareInfo[key] && customShareInfo[key].redirectRoute) {
            this.props.history.replaceState(null, customShareInfo[key].redirectRoute);
        } else {
            this.props.history.replaceState(null, `/activations`);
        }
    }

    render() {
        const { key } = this.props.params;
        const shareInfo = customShareInfo && customShareInfo[key] ? customShareInfo[key] : {};
        const { query } = this.props.location;

        return (
            <BasicSharePage
                title   = {shareInfo.title ? strformat(shareInfo.title, query) : ''}
                text    = {shareInfo.description ? strformat(shareInfo.description, query) : ''}
                picture = {shareInfo.pictureURL}
            />
        );
    }
}

function mapStateToProps({ currentActivation: {activation, authorActivations, isLoading} }) {
    return {
        activation,
        authorActivations,
        isLoading
    };
}

export default CustomShareResultPageContainer;
