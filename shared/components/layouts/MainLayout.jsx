import React, {Component, PropTypes} from 'react';

import WelcomeDialog from '../WelcomeDialog.jsx';

export default class MainLayout extends Component {

    static propTypes = {
        showWelcomeScreen: PropTypes.bool,
        showFooter: PropTypes.bool,
        footerLinks: PropTypes.object,
        onWelcomeScreenClose: PropTypes.func
    };

    render() {
        const {showWelcomeScreen, showFooter, footerLinks, onWelcomeScreenDismiss} = this.props;

        return (
            <div className='MainLayout'>
                <WelcomeDialog
                    isOpen={showWelcomeScreen}
                    onDismiss={onWelcomeScreenDismiss}
                />

                <div className='MainLayout__content'>
                    {this.props.children}
                </div>

                <div className='MainLayout__footer'>

                </div>
            </div>
        );
    }
}
