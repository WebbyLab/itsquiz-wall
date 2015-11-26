import React, {Component, PropTypes} from 'react';

import { getSupportedLocales } from '../utils';

import LanguageSwitch from '../components/LanguageSwitch.jsx';

const SUPPORTED_LOCALES = getSupportedLocales();

export default class LanguageSwitchContainer extends Component {
    static contextTypes = { i18n: PropTypes.object };

    handleSelectLanguage = (newLocale) => {
        // TODO : Make locale be changed dynamically without page reload
        const url = window.location.href.toLowerCase();
        const { getLocale } = this.context.i18n;
        const newUrl = url.replace(`/${getLocale()}/`, `/${newLocale}/`);
        window.open(newUrl, '_self');
    };

    render() {
        const { getLocale } = this.context.i18n;

        return (
            <LanguageSwitch
                languages={SUPPORTED_LOCALES}
                selectedLanguage={getLocale()}
                onSelect={this.handleSelectLanguage}
            />
        );
    }
}
