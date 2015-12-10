import React, {Component, PropTypes} from 'react';
import strformat          from 'strformat';

import Footer from '../components/Footer.jsx';

import { footerLinks, quizwallShareLink, facebookAppId } from '../config';

import { sendEvent } from '../utils/googleAnalytics';

export default class FooterContainer extends Component {

    static contextTypes = { i18n: PropTypes.object };

    handleLinkClick = (type) => {
        const { getLocale } = this.context.i18n;
        const linkToOpen = strformat(footerLinks[type], {
            lang: getLocale()
        });

        this.openLinkInNewTab(linkToOpen);

        sendEvent('footer', 'click', type);
    };

    handleShare = (type) => {
        const { getLocale } = this.context.i18n;
        const linkToShare = strformat(quizwallShareLink, {
            lang: getLocale()
        });

        const linksHash = {
            'google': `https://plus.google.com/share?url=${linkToShare}`,
            'facebook': `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&&display=popup`
                + `&href=${linkToShare}&redirect_uri=${linkToShare}`,
            'twitter': `https://twitter.com/intent/tweet?text=${linkToShare}`,
            'linkedin': `https://www.linkedin.com/shareArticle?mini=true&url=${linkToShare}`,
            'vk': `http://vk.com/share.php?url=${linkToShare}`
        };

        this.openLinkInPopup(linksHash[type]);

        sendEvent('footer', 'share', type);
    };

    render() {
        return (
            <Footer
                onLinkClick={this.handleLinkClick}
                onShareClick={this.handleShare}
            />
        );
    }

    openLinkInPopup(URL) {
        window.open(URL, '', 'width=500, height=500');
    }

    openLinkInNewTab(URL) {
        window.open(URL, '_blank');
    }
}

