import React, {Component, PropTypes} from 'react';

import { getSupportedLocales } from '../utils';

import LanguageSwitch from '../components/LanguageSwitch.jsx';

const SUPPORTED_LOCALES = getSupportedLocales();

export default class LanguageSwitchContainer extends Component {

    componentDidMount() {
        const url = window.location.href;
        this.currentLocale = SUPPORTED_LOCALES.find(locale => url.indexOf(`/${locale}/`) !== -1);
    }

    handleSelectLanguage = (newLocale) => {
        // TODO : Make locale be changed dynamically without page reload
        const url = window.location.href;
        const newUrl = url.replace(`/${this.currentLocale}/`, `/${newLocale}/`);
        window.open(newUrl, '_self');
    };

    render() {
        return (
            <LanguageSwitch
                languages={SUPPORTED_LOCALES}
                selectedLanguage={this.currentLocale}
                onSelect={this.handleSelectLanguage}
            />
        );
    }
}
