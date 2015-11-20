import React from 'react';

import Dialog    from './Dialog.jsx';
import Button    from 'react-mdl/lib/Button';
import Icon      from './Icon.jsx';

if ( process.env.BROWSER ) {
    require('./ShareDialog.less');
}

export default class ShareDialog extends React.Component {

    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
    };

    static defaultProps = {
    };

    postOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${this.props.linkToShare}`, '', 'width=500, height=500');
    };

    postOnGooglePlus = () => {
        window.open(`https://plus.google.com/share?url=${this.props.linkToShare}`, '', 'width=500, height=500');
    };

    postOnFacebook = () => {
        window.open(`https://www.facebook.com/dialog/share?app_id=91c5e258ac327601d50538b3578af343&&display=popup&href=${this.props.linkToShare}&redirect_uri=${this.props.linkToShare}`, '', 'width=500, height=500');
    };

    postOnLinkedin = () => {
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${this.props.linkToShare}`, '', 'width=500, height=500');
    };

    postOnVK = () => {
        window.open(`http://vk.com/share.php?url=${this.props.linkToShare}`, '', 'width=500, height=500');
    };

    render() {
        const { katya, ...otherProps } = this.props;
        const { l } = this.context.i18n;

        return (
            <div className='ShareDialog'>
                <Dialog
                    className = 'ShareDialog__dialog'
                    title     = {l('Share test')}
                    {...otherProps}>
                    <div className='ShareDialog__buttons-container'>
                        <div className='ShareDialog__button ShareDialog__button--facebook' onClick={this.postOnFacebook}>
                            <Icon type='facebook' className='ShareDialog__icon'/>
                        </div>

                        <div className='ShareDialog__button ShareDialog__button--google' onClick={this.postOnGooglePlus}>
                            <Icon type='google-plus' className='ShareDialog__icon'/>
                        </div>

                        <div className='ShareDialog__button ShareDialog__button--twitter' onClick={this.postOnTwitter}>
                            <Icon type='twitter' className='ShareDialog__icon'/>
                        </div>

                        <div className='ShareDialog__button ShareDialog__button--vk'  onClick={this.postOnVK}>
                            <Icon type='vk' className='ShareDialog__icon'/>
                        </div>

                        <div className='ShareDialog__button ShareDialog__button--linkedin' onClick={this.postOnLinkedin}>
                            <Icon type='linkedin' className='ShareDialog__icon'/>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

