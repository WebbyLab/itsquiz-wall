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
        title          : PropTypes.string.isRequired,
        isOpen         : PropTypes.bool.isRequired,
        onShare        : PropTypes.func.isRequired,
        onRequestClose : PropTypes.func.isRequired
    };

    render() {
        const { l } = this.context.i18n;
        const { title, onShare } = this.props;

        return (
            <div className='ShareDialog'>
                <Dialog
                    className = 'ShareDialog__dialog'
                    title     = {title}
                    {...this.props}>
                    <div className='ShareDialog__buttons-container'>
                        <div
                            className='ShareDialog__button ShareDialog__button--facebook'
                            onClick={onShare.bind(null, 'facebook')}>
                            <Icon type='facebook' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--google'
                            onClick={onShare.bind(null, 'google')}>
                            <Icon type='google-plus' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--twitter'
                            onClick={onShare.bind(null, 'twitter')}>
                            <Icon type='twitter' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--vk'
                            onClick={onShare.bind(null, 'vk')}>
                            <Icon type='vk' className='ShareDialog__icon'/>
                        </div>

                        <div
                            className='ShareDialog__button ShareDialog__button--linkedin'
                            onClick={onShare.bind(null, 'linkedin')}>
                            <Icon type='linkedin' className='ShareDialog__icon'/>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}
