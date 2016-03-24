import React from 'react';

import Markdown from '../Markdown.jsx';

import { Card } from 'react-mdl/lib/Card';

if (process.env.BROWSER) {
    require('./PromoPage.less');
}

export default class PromoPage extends React.Component {
    static propTypes = {
        title   : React.PropTypes.string,
        picture : React.PropTypes.string,
        text    : React.PropTypes.string
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
