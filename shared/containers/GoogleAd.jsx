import React, { Component, PropTypes } from 'react';

import { ads } from '../config.js';

import GoogleAd from 'react-google-ad';

export default class GoogleAdContainer extends Component {
    static propTypes = {
        type : PropTypes.string.isRequired
    };

    render() {
        const { type } = this.props;

        if (!type || !ads || !ads[type]) {
            return null;
        }

        const adInfo = ads[type];

        return (
            <GoogleAd
                client={adInfo.client}
                slot={adInfo.slot}
                format={adInfo.format}
            />
        );
    }
}
