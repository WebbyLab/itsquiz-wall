import PropTypes from 'prop-types';
import React from 'react';

import { Card } from 'react-mdl/lib/Card';

import Markdown from '../Markdown.jsx';

import './PromoPage.less';

export default class PromoPage extends React.Component {
    static propTypes = {
        title   : PropTypes.string,
        picture : PropTypes.string,
        text    : PropTypes.string
    };

    render() {
        const {
            picture,
            text
        } = this.props;

        return (
            <div className='PromoPage'>
                <img className='PromoPage__head' src={picture} />
                <Card shadow={1} className='PromoPage__content'>
                    <Markdown source={text} />
                </Card>
            </div>
        );
    }
}