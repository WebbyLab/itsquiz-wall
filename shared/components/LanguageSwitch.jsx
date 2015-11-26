import React from 'react';
import cx from 'classnames';

if ( process.env.BROWSER ) {
    require('./LanguageSwitch.less');
}

export default ({selectedLanguage, languages, onSelect, className}) => {
    return (
        <div className='LanguageSwitch'>
            <select
                className={cx('LanguageSwitch__select', className)}
                value={selectedLanguage}
                onChange={(e) => onSelect(e.target.value)}>
                {
                    languages.map(lang =>
                        <option key={lang} value={lang}> {lang.toUpperCase()} </option>
                    )
                }
            </select>
        </div>
    );
};
