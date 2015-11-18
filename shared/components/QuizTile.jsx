import React from 'react';

if ( process.env.BROWSER ) {
    require('./QuizTile.less');
}

import { Card,
    CardTitle,
    CardActions
} from 'react-mdl/lib/card';

import Button     from 'react-mdl/lib/Button';
import IconButton from 'react-mdl/lib/IconButton';
import Icon       from 'react-mdl/lib/Icon';

export default class QuizTile extends React.Component {
    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
        id                : React.PropTypes.string,
        name              : React.PropTypes.string,
        message           : React.PropTypes.string,
        pictureURL        : React.PropTypes.string,
        author            : React.PropTypes.object,
        onClick           : React.PropTypes.func
    };

    render() {
        const {id, name, pictureURL, author, onClick} = this.props;
        const {l} = this.context.i18n;

        return (
            <Card className='QuizTile' shadow={1}>
                <CardTitle
                    className='QuizTile__title'>
                    <img src={pictureURL} width='100%' onClick={onClick}/>
                </CardTitle>

                <CardActions className='QuizTile__text'>
                    <div className='QuizTile__name' onClick={onClick}>
                        {name}
                    </div>

                    <div className='QuizTile__author'>
                        {author.fullName}
                    </div>
                </CardActions>
            </Card>
        );
    }
}

