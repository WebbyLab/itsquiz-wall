import React, { Component, PropTypes } from 'react';

import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';

if (process.env.BROWSER) {
    require('./QuizTile.less');
}

export default class QuizTile extends Component {
    static propTypes = {
        id                : PropTypes.string,
        name              : PropTypes.string,
        message           : PropTypes.string,
        pictureURL        : PropTypes.string,
        author            : PropTypes.object,
        userQuizSession   : PropTypes.object,
        isPassed          : PropTypes.bool,
        onClick           : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick();
    };

    render() {
        const { id, name, pictureURL, author, userQuizSession, isPassed, onClick } = this.props;

        return (
            <Card className='QuizTile' shadow={1}>
                <CardTitle
                    className='QuizTile__title'
                >
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
                    <a
                        href={`/activations/${id}`}
                        title={name}
                        className='QuizTile__name'
                        onClick={this.handleClick}
                    >
                        {name}
                    </a>

                    <div className='QuizTile__author'>
                        {author.fullName}
                    </div>
                </CardActions>
            </Card>
        );
    }
}
