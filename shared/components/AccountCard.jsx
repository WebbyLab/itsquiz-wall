import React, { Component, PropTypes } from 'react';
import cx                              from 'classnames';

import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import Button                          from 'react-mdl/lib/Button';

import { sprintf }                     from '../utils';

import './QuizCard.less';

export default class AccountCard extends Component {
    static propTypes = {
        account              : PropTypes.object,
        onClick              : PropTypes.func,
        className            : PropTypes.string
    };

    static contextTypes = { i18n: PropTypes.object };

    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick();
    };

    render() {
        const {
            account,
            onClick,
            className
        } = this.props;

        const { l, nl } = this.context.i18n;

        const classes = cx('QuizCard', className);
        const numberOfActivations = account.activations.length;


        return (
            <Card shadow={1} className={classes}>
                <CardTitle className='QuizCard__head'>
                    <div className='QuizCard__info' >
                        <div className='QuizCard__name-author'>
                            <a
                                href={`/accounts/${account.id}`}
                                className='QuizCard__name'
                                onClick={onClick}
                                title={account.fullName}
                            >
                                {account.fullName}
                            </a>
                        </div>
                    </div>
                </CardTitle>
                <div
                    className='QuizCard__media'
                    onClick={onClick}
                    style={{ background: `url(${account.avatar}) center / cover` }}
                />

                <div className='QuizCard__content'>
                    <div className='QuizCard__details'>
                        <span>
                            {
                                    sprintf(
                                        nl('%d test', '%d tests', numberOfActivations),
                                        numberOfActivations
                                    )
                                }
                        </span>
                    </div>
                    <p className='QuizCard__text'> {account.statusMessage} </p>
                </div>

                <CardActions
                    border
                >
                    <Button
                        colored
                        // commenting out the prop `ripple`  that the onClick event does not work on mobile
                        // ripple
                        className = 'QuizCard__more-button'
                        onClick   = {this.handleClick}
                    >
                        {l('View details')}
                    </Button>
                </CardActions>
            </Card>
        );
    }
}
