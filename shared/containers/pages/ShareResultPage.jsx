import React, { Component, PropTypes } from 'react';
import { connect }                   from 'react-redux';

import { loadActivation }  from '../../actions/activations';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import { sendEvent }       from '../../utils/googleAnalytics';

class ShareResultPageContainer extends Component {
    static propTypes = {
        location   : PropTypes.object,
        params     : PropTypes.object,
        history    : PropTypes.object,
        activation : PropTypes.object
    };

    componentDidMount() {
        const { id } = this.props.params;
        const { activation } = this.props;

        console.log('activation', activation);
        console.log('this.props.history', this.props.history);

        sendEvent('share result', 'direct open', activation.name);

        if (activation.isPrivate) {
            console.log('activation.isPrivate', activation.isPrivate);
            this.props.history.replaceState(null, '/activations', {
                ...this.props.location.query
            });
        } else {
            console.log('ELSE');
            this.props.history.replaceState(null, `/activations/${id}`, {
                ...this.props.location.query
            });
        }
    }

    render() {
        return (
            <div />
        );
    }
}

function mapStateToProps({ currentActivation: { activation, authorActivations, isLoading } }) {
    return {
        activation,
        authorActivations,
        isLoading
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(ShareResultPageContainer, [ loadActivation ])
);
