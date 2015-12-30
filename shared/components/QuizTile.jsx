import React, {Component, PropTypes} from 'react';

if ( process.env.BROWSER ) {
    require('./QuizTile.less');
}

import { Card,
    CardTitle,
    CardActions
} from 'react-mdl/lib/Card';

import Button     from 'react-mdl/lib/Button';
import IconButton from 'react-mdl/lib/IconButton';
import Icon       from 'react-mdl/lib/Icon';

export default class QuizTile extends Component {
    static contextTypes = { i18n: PropTypes.object };

    static propTypes = {
        id                : PropTypes.string,
        name              : PropTypes.string,
        message           : PropTypes.string,
        pictureURL        : PropTypes.string,
        author            : PropTypes.object,
        onClick           : PropTypes.func
    };

    render() {
        const {id, name, pictureURL, author, userQuizSession, isPassed, onClick} = this.props;
        const {l} = this.context.i18n;

        return (
            <Card className='QuizTile' shadow={1}>
                <CardTitle
                    className='QuizTile__title'>
                    <img src={pictureURL} width='100%' onClick={onClick}/>
                    {
                        isPassed
                        ? <div className='QuizTile__overlay' onClick={onClick}>
                            <span className='QuizTile__user-score'>
                                {userQuizSession.score}%
                            </span>
                        </div>
                        : null
                    }
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

