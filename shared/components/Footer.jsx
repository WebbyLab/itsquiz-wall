import React, {Component, PropTypes} from 'react';

import Icon from './Icon.jsx';

if ( process.env.BROWSER ) {
    require('./Footer.less');
}

export default class Footer extends Component {
    static contextTypes = { i18n: PropTypes.object };

    render() {
        const { l } = this.context.i18n;
        const { onLinkClick, onShareClick } = this.props;

        return (
            <div className='Footer'>
                <div className="Footer__content">
                    <div className="Footer__socials">
                        <Icon
                            type='facebook-box'
                            className='Footer__social-icon Footer__social-icon--facebook'
                            onClick={onShareClick.bind(null, 'facebook')}
                        />
                        <Icon
                            type='google-plus-box'
                            className='Footer__social-icon Footer__social-icon--google-plus'
                            onClick={onShareClick.bind(null, 'google')}
                        />
                        <Icon
                            type='linkedin-box'
                            className='Footer__social-icon Footer__social-icon--linkedin'
                            onClick={onShareClick.bind(null, 'linkedin')}
                        />
                        <Icon
                            type='twitter-box'
                            className='Footer__social-icon Footer__social-icon--twitter'
                            onClick={onShareClick.bind(null, 'twitter')}
                        />
                        <Icon
                            type='vk-box'
                            className='Footer__social-icon Footer__social-icon--vk'
                            onClick={onShareClick.bind(null, 'vk')}
                        />
                    </div>

                    <div className="Footer__menus-container">
                        <div className="Footer__menu">
                            <h3 className="Footer__menu-header">{l('Keep in touch')}</h3>
                            <ul className="Footer__menu-items">
                                <li>
                                    <a onClick={onLinkClick.bind(null, 'twitter')}>
                                        {l('Twitter')}
                                    </a>
                                </li>
                                <li>
                                    <a onClick={onLinkClick.bind(null, 'facebook')}>
                                        {l('Facebook')}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="Footer__menu">
                            <h3 className="Footer__menu-header">{l('Help center')}</h3>
                            <ul className="Footer__menu-items">
                                <li>
                                    <a onClick={onLinkClick.bind(null, 'supportPage')}>
                                        {l('Support page')}
                                    </a>
                                </li>
                                <li>
                                    <a onClick={onLinkClick.bind(null, 'helpMe')} >
                                        {l('Need help?')}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="Footer__menu">
                            <h3 className="Footer__menu-header">{l('Learn more')}</h3>
                            <ul className="Footer__menu-items">
                                <li>
                                    <a onClick={onLinkClick.bind(null, 'aboutItsquiz')}>
                                        {l('About It\'s quiz')}
                                    </a>
                                </li>
                                <li>
                                    <a onClick={onLinkClick.bind(null, 'features')}>
                                        {l('Features')}
                                    </a>
                                </li>
                                <li>
                                    <a onClick={onLinkClick.bind(null, 'team')}>
                                        {l('Our team')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

