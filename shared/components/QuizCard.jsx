import React from 'react';

if ( process.env.BROWSER ) {
    require('./QuizCard.less');
}

import { Card, CardTitle, CardActions } from 'react-mdl/lib/card';
import Button from 'react-mdl/lib/Button';
import IconButton from 'react-mdl/lib/IconButton';
import Icon from 'react-mdl/lib/Icon';

export default class QuizCard extends React.Component {
    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
        id                : React.PropTypes.string,
        name              : React.PropTypes.string,
        message           : React.PropTypes.string,
        timeToPass        : React.PropTypes.number,
        numberOfQuestions : React.PropTypes.number,
        pictureURL        : React.PropTypes.string,
        author            : React.PropTypes.object,
        onClick           : React.PropTypes.func
    };

    render() {
        const { id, name, message, timeToPass, numberOfQuestions, pictureURL, author, onClick } = this.props;
        const { l } = this.context.i18n;

        return (
            <Card className='QuizCard' shadowLevel={1}>
                <CardTitle className='QuizCard__head'>
                    <div className='QuizCard__info'>
                        <img className='QuizCard__avatar' src={author.avatar} />
                        <div className='QuizCard__name-author'>
                            <div className='QuizCard__name' onClick={onClick}>
                                {name}
                            </div>

                            <div className='QuizCard__author'>
                                {author.fullName}
                            </div>
                        </div>
                    </div>
                </CardTitle>

                <div
                    className='QuizCard__media'
                    onClick={onClick}
                    style={{background: `url(${pictureURL}) center / cover`}}
                />

                <CardActions
                    border={true}
                    className='QuizCard__actions'>
                    <div>
                        <IconButton
                            colored={true}
                            name="share"
                        />
                    </div>

                    <Button
                        colored={true}
                        onClick={onClick}>
                        {l('View details')}
                    </Button>
                </CardActions>
            </Card>
        );
    }
}
