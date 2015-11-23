import React, {Component, PropTypes} from 'react';

import Dialog    from './Dialog.jsx';
import Button    from 'react-mdl/lib/Button';
import Icon      from './Icon.jsx';

import { facebookAppId } from '../config';

if ( process.env.BROWSER ) {
    require('./ShareDialog.less');
}

export default class ShareDialog extends Component {

    static contextTypes = { i18n: PropTypes.object };

    static propTypes = {
        linkToShare    : PropTypes.string.isRequired,
        onRequestClose : PropTypes.func.isRequired
    };

    postOnTwitter = () => {
        this.openLinkInPopup(`https://twitter.com/intent/tweet?text=${this.props.linkToShare}`);
    };

    postOnGooglePlus = () => {
        this.openLinkInPopup(`https://plus.google.com/share?url=${this.props.linkToShare}`);
    };

    postOnFacebook = () => {
        this.openLinkInPopup(`https://www.facebook.com/dialog/share?app_id=${facebookAppId}&&display=popup`
            + `&href=${this.props.linkToShare}&redirect_uri=${this.props.linkToShare}`);
    };

    postOnLinkedin = () => {
        this.openLinkInPopup(`https://www.linkedin.com/shareArticle?mini=true&url=${this.props.linkToShare}`);
    };

    postOnVK = () => {
        this.openLinkInPopup(`http://vk.com/share.php?url=${this.props.linkToShare}`);
    };

    openLinkInPopup = (URL) => {
        window.open(URL, '', 'width=500, height=500');
    };

    render() {
        const { l } = this.context.i18n;

        return (
            <div className='ShareDialog'>
                <Dialog
                    className = 'ShareDialog__dialog'
                    title     = {l('Share test')}
                    {...this.props}>
                    <div className='ShareDialog__buttons-container'>
                        <div
                            className='ShareDialog__button ShareDialog__button--facebook'
                            onClick={this.postOnFacebook}>
                            <Icon type='facebook' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--google'
                            onClick={this.postOnGooglePlus}>
                            <Icon type='google-plus' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--twitter'
                            onClick={this.postOnTwitter}>
                            <Icon type='twitter' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--vk'
                            onClick={this.postOnVK}>
                            <Icon type='vk' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--linkedin'
                            onClick={this.postOnLinkedin}>
                            <Icon type='linkedin' className='ShareDialog__icon'/>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

