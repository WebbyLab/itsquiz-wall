'use strict';

import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import BasicSharePage from '../../components/pages/BasicSharePage.jsx';

import { customShareInfo } from '../../config';
import { loadActivation }  from '../../actions/activations';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import { sendEvent }       from '../../utils/googleAnalytics';

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
        const { title, description, pictureURL } = customShareInfo && customShareInfo[key] ? customShareInfo[key] : {};

        return (
            <BasicSharePage
                title={title}
                text={description}
                picture={pictureURL}
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
