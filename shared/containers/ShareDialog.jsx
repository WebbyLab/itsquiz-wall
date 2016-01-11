import React, { Component, PropTypes } from 'react';

import ShareDialog from '../components/ShareDialog.jsx';

import { facebookAppId } from '../config';

import { sendEvent } from '../utils/googleAnalytics';

export default class ShareDialogContainer extends Component {

    static propTypes = {
        isOpen         : PropTypes.bool.isRequired,
        twitterMessage : PropTypes.string,
        linkToShare    : PropTypes.string.isRequired,
        onRequestClose : PropTypes.func
    };

    static defaultProps = {
        twitterMessage : ''
    };

    handleShare = (type) => {
        const { linkToShare, twitterMessage } = this.props;

        const linksHash = {
            'google': `https://plus.google.com/share?url=${linkToShare}`,
            'facebook': `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&display=popup`
                + `&href=${linkToShare}&redirect_uri=${linkToShare}`,
            'twitter': `https://twitter.com/intent/tweet?text=${encodeURI(twitterMessage)}&url=${linkToShare}&via=itsquizcom`,
            'linkedin': `https://www.linkedin.com/shareArticle?mini=true&url=${linkToShare}`,
            'vk': `http://vk.com/share.php?url=${linkToShare}`
        };

        this.openLinkInPopup(linksHash[type]);

        sendEvent('activation', 'share', type);
    };

    openLinkInPopup = (URL) => {
        window.open(URL, '', 'width=500, height=500');
    };

    render() {
        const { title, isOpen, onRequestClose } = this.props;

        return (
            <ShareDialog
                title          = {title}
                isOpen         = {isOpen}
                onShare        = {this.handleShare}
                onRequestClose = {onRequestClose}
            />
        );
    }
}

