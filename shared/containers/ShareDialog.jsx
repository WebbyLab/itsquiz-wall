import React, {Component, PropTypes} from 'react';

import ShareDialog from '../components/ShareDialog.jsx';

import { facebookAppId } from '../config';

import { sendEvent } from '../utils/googleAnalytics';

export default class ShareDialogContainer extends Component {

    static propTypes = {
        isOpen         : PropTypes.bool.isRequired,
        linkToShare    : PropTypes.string.isRequired,
        onRequestClose : PropTypes.func
    };

    handleShare = (type) => {
        const { linkToShare } = this.props;
        const linksHash = {
            'google': `https://plus.google.com/share?url=${this.props.linkToShare}`,
            'facebook': `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&&display=popup`
                + `&href=${this.props.linkToShare}&redirect_uri=${this.props.linkToShare}`,
            'twitter': `https://twitter.com/intent/tweet?text=${this.props.linkToShare}`,
            'linkedin': `https://www.linkedin.com/shareArticle?mini=true&url=${this.props.linkToShare}`,
            'vk': `http://vk.com/share.php?url=${this.props.linkToShare}`
        };

        this.openLinkInPopup(linksHash[type]);

        sendEvent('activation', 'share', type);
    };

    openLinkInPopup = (URL) => {
        window.open(URL, '', 'width=500, height=500');
    };

    render() {
        const { isOpen, onRequestClose } = this.props;

        return (
            <ShareDialog
                isOpen         = {isOpen}
                onShare        = {this.handleShare}
                onRequestClose = {onRequestClose}
            />
        );
    }
}

