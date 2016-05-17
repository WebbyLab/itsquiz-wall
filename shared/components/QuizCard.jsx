import React, { Component, PropTypes } from 'react';
import cx                              from 'classnames';

if (process.env.BROWSER) {
    require('./QuizCard.less');
}

import { makeSlug } from '../utils/urlUtil';

import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import Button                           from 'react-mdl/lib/Button';
import IconButton                       from 'react-mdl/lib/IconButton';
import MdiIcon                          from './Icon.jsx';

import { sprintf } from '../utils';

export default class QuizCard extends Component {
    static propTypes = {
        id                : PropTypes.string,
        name              : PropTypes.string,
        message           : PropTypes.string,
        timeToPass        : PropTypes.number,
        numberOfQuestions : PropTypes.number,
        pictureURL        : PropTypes.string,
        author            : PropTypes.object,
        isSponsored       : PropTypes.bool,
        className         : PropTypes.string,
        category          : PropTypes.string,
        isPassed          : PropTypes.bool,
        userQuizSession   : PropTypes.object,
        onShare           : PropTypes.func,
        onClick           : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick();
    };

    getCategoryLabel = (category) => {
        const { l } = this.context.i18n;

        const categoryLabels = {
            'EDUCATION': l('Education'),
            'ENTERTAINMENT': l('Entertainment'),
            'VACANCY': l('Vacancy')
        };

        return categoryLabels[category];
    };

    render() {
        const {
            id,
            name,
            message,
            className,
            category,
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

        const { l, nl, humanizeDuration } = this.context.i18n;

        const classes = cx('QuizCard', className, {
            'QuizCard--sponsored': isSponsored
        });


        return (
            <Card shadow={1} className={classes}>
                <CardTitle className='QuizCard__head'>
                    <div className='QuizCard__info'>
                        <img className='QuizCard__avatar' src={author.avatar} />
                        <div className='QuizCard__name-author'>
                            <a
                                href={`/activations/${id}/${makeSlug(name)}`}
                                className='QuizCard__name'
                                onClick={this.handleClick}
                                title={name}
                            >
                                {name}
                            </a>

                            <div className='QuizCard__author' title={author.fullName}>
                                {author.fullName}
                            </div>
                        </div>
                    </div>
                </CardTitle>

                <div
                    className='QuizCard__media'
                    onClick={onClick}
                    style={{ background: `url(${pictureURL}) center / cover` }}
                >
                    {
                        isPassed
                        ? <div className='QuizCard__overlay'>
                            <span className='QuizCard__user-score'>
                                {userQuizSession.score}%
                            </span>
                        </div>
                        : null
                    }

                    <div className='QuizCard__category'>
                        {this.getCategoryLabel(category)}
                    </div>
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
                                        nl('%d question', '%d questions', numberOfQuestions),
                                        numberOfQuestions
                                    )
                                }
                            </span>
                            <span className='QuizCard__span-divider'>•</span>
                            <span>{humanizeDuration(timeToPass, 'second')}</span>
                        </div>
                    }

                    <p className='QuizCard__text'> {message} </p>
                </div>

                <CardActions
                    border
                    className='QuizCard__actions'
                >
                    <div>
                        <IconButton
                            colored
                            className = 'QuizCard__share-button'
                            name      = 'share'
                            onClick   = {onShare}
                        />
                    </div>

                    <Button
                        colored
                        ripple
                        className = 'QuizCard__more-button'
                        raised    = {isSponsored}
                        onClick   = {onClick}
                    >
                        {l('View details')}
                    </Button>
                </CardActions>
            </Card>
        );
    }
}
