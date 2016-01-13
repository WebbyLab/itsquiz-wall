import React, { Component, PropTypes } from 'react';
import cx                              from 'classnames';

if ( process.env.BROWSER ) {
    require('./QuizCard.less');
}

import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import Button                           from 'react-mdl/lib/Button';
import IconButton                       from 'react-mdl/lib/IconButton';
import Icon                             from 'react-mdl/lib/Icon';
import MdiIcon                          from './Icon.jsx';

import { sprintf } from '../utils';

export default class QuizCard extends Component {
    static contextTypes = { i18n: PropTypes.object };

    static propTypes = {
        id                : PropTypes.string,
        name              : PropTypes.string,
        message           : PropTypes.string,
        timeToPass        : PropTypes.number,
        numberOfQuestions : PropTypes.number,
        pictureURL        : PropTypes.string,
        author            : PropTypes.object,
        isSponsored       : PropTypes.bool,
        onClick           : PropTypes.func
    };

    render() {
        const {
            id,
            name,
            message,
            timeToPass,
            numberOfQuestions,
            pictureURL,
            author,
            isSponsored,
            isPassed,
            userQuizSession,
            onClick,
            onShare
        } = this.props;
        const { l, ngettext, humanizeDuration } = this.context.i18n;

        const classes = cx('QuizCard', {
            'QuizCard--sponsored': isSponsored
        });

        return (
            <Card className={classes} shadow={1}>
                <CardTitle className='QuizCard__head'>
                    <div className='QuizCard__info'>
                        <img className='QuizCard__avatar' src={author.avatar} />
                        <div className='QuizCard__name-author'>
                            <div className='QuizCard__name' onClick={onClick} title={name}>
                                {name}
                            </div>

                            <div className='QuizCard__author' title={author.fullName}>
                                {author.fullName}
                            </div>
                        </div>
                    </div>
                </CardTitle>

                <div
                    className='QuizCard__media'
                    onClick={onClick}
                    style={{background: `url(${pictureURL}) center / cover`}}>
                    {
                        isPassed
                        ? <div className='QuizCard__overlay'>
                            <span className='QuizCard__user-score'>
                                {userQuizSession.score}%
                            </span>
                        </div>
                        : null
                    }
                </div>

                <div className='QuizCard__content'>
                    {
                        isSponsored
                        ? <div className='QuizCard__special' onClick = {onClick}>
                            <MdiIcon type='gift' /> {l('Special proposition!')}
                        </div>
                        : <div className='QuizCard__details'>
                            <span>
                                {
                                    sprintf(
                                        ngettext('%d question', '%d questions', numberOfQuestions),
                                        numberOfQuestions
                                    )
                                }
                            </span>
                            <span className='QuizCard__span-divider'>•</span>
                            <span>{ humanizeDuration(timeToPass, 'second') }</span>
                        </div>
                    }

                    <p className='QuizCard__text'> {message} </p>
                </div>

                <CardActions
                    border={true}
                    className='QuizCard__actions'>
                    <div>
                        <IconButton
                            className = 'QuizCard__share-button'
                            colored   = {true}
                            name      = 'share'
                            onClick   = {onShare}
                        />
                    </div>

                    <Button
                        className = 'QuizCard__more-button'
                        raised    = {isSponsored}
                        colored   = {true}
                        ripple    = {true}
                        onClick   = {onClick}>
                        {l('View details')}
                    </Button>
                </CardActions>
            </Card>
        );
    }
}
