import React from 'react';
import cx    from 'classnames';

import { Card, CardTitle } from 'react-mdl/lib/Card';
import Grid, { Cell }      from 'react-mdl/lib/Grid';
import Button              from 'react-mdl/lib/Button';
import IconButton          from 'react-mdl/lib/IconButton';
import Spinner             from 'react-mdl/lib/Spinner';

import QuizTile             from '../QuizTile.jsx';
import Icon                 from '../Icon.jsx';
import ShareDialog          from '../../containers/ShareDialog.jsx';
import LoginDialog          from '../../containers/LoginDialog.jsx';
import AppBarWithBackground from '../AppBarWithBackground.jsx';
import ExpandableText       from '../ExpandableText.jsx';

import { sprintf } from '../../utils';

if (process.env.BROWSER) {
    require('./ActivationPage.less');
}

export default class ActivationPage extends React.Component {
    static propTypes = {
        activation         : React.PropTypes.object,
        authorActivations  : React.PropTypes.array(React.PropTypes.object),
        similarActivations : React.PropTypes.array(React.PropTypes.object),
        showUserResult     : React.PropTypes.bool,
        sharingLink        : React.PropTypes.string,
        userQuizSession    : React.PropTypes.object,
        isLoading          : React.PropTypes.bool,
        isLoggingIn        : React.PropTypes.bool,
        isEmbedded         : React.PropTypes.bool,
        dueTime            : React.PropTypes.string,
        onPass             : React.PropTypes.func,
        onShare            : React.PropTypes.func,
        onLoginDialogClose : React.PropTypes.func,
        onStopSharing      : React.PropTypes.func,
        onGoBack           : React.PropTypes.func,
        onShareResult      : React.PropTypes.func,
        onFillProfile      : React.PropTypes.func,
        onSponsoredClick   : React.PropTypes.func,
        onViewAnswers      : React.PropTypes.func,
        onActivationClick  : React.PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    componentWillMount() {
        const { l } = this.context.i18n;

        this.sponsoredButtonLabel = Math.random() < 0.5 ? l('Contact me') : l('Get the gift');
    }

    getGreetingPhrase = (grade) => {
        const { l } = this.context.i18n;

        const phrases = {
            'verybad'   : l('You could do better!'),
            'bad'       : l('You could do better!'),
            'normal'    : l('Good job!'),
            'good'      : l('Great result!'),
            'excellent' : l('You rock! Excellent job!')
        };

        return phrases[grade];
    };

    renderAuthorActivations = () => {
        const {
            activation,
            authorActivations,
            showUserResult,
            onActivationClick
        } = this.props;

        const { l } = this.context.i18n;

        if (authorActivations && authorActivations.length) {
            return (
                <div className='ActivationPage__author-activations'>
                    <div className='ActivationPage__subheader'>
                        {sprintf(l('More tests by %s'), activation.author.fullName)}
                    </div>

                    <Grid className='ActivationPage__author-activations-grid'>
                    {
                        authorActivations.map(authorActivation =>
                            <Cell
                                key    = {authorActivation.id}
                                align  = 'stretch'
                                col    = {3}
                                phone  = {2}
                                tablet = {3}
                            >
                                <QuizTile
                                    id                = {authorActivation.id}
                                    name              = {authorActivation.name}
                                    timeToPass        = {authorActivation.timeToPass}
                                    numberOfQuestions = {authorActivation.numberOfQuestions}
                                    pictureURL        = {authorActivation.pictureURL}
                                    author            = {activation.author}
                                    isPassed          = {showUserResult && authorActivation.isPassed}
                                    userQuizSession   = {authorActivation.userQuizSession}
                                    onClick           = {onActivationClick.bind(null, authorActivation)}
                                />
                            </Cell>
                        )
                    }
                    </Grid>
                </div>
            );
        }

        return null;
    };

    renderSimilarActivations = () => {
        const {
            similarActivations,
            showUserResult,
            onActivationClick
        } = this.props;

        const { l } = this.context.i18n;

        if (similarActivations && similarActivations.length) {
            return (
                <div className='ActivationPage__similar-activations'>
                    <div className='ActivationPage__subheader'>
                        {l('Similar tests')}
                    </div>

                    <Grid className='ActivationPage__similar-activations-grid'>
                    {
                        similarActivations.map(similarActivation =>
                            <Cell
                                key    = {similarActivation.id}
                                align  = 'stretch'
                                col    = {3}
                                phone  = {2}
                                tablet = {3}
                            >
                                <QuizTile
                                    id                = {similarActivation.id}
                                    name              = {similarActivation.name}
                                    timeToPass        = {similarActivation.timeToPass}
                                    numberOfQuestions = {similarActivation.numberOfQuestions}
                                    pictureURL        = {similarActivation.pictureURL}
                                    author            = {similarActivation.author}
                                    isPassed          = {showUserResult && similarActivation.isPassed}
                                    userQuizSession   = {similarActivation.userQuizSession}
                                    onClick           = {onActivationClick.bind(null, similarActivation)}
                                />
                            </Cell>
                        )
                    }
                    </Grid>
                </div>
            );
        }

        return null;
    };

    renderContent = () => {
        const {
            activation,
            isLoading,
            showUserResult,
            onPass,
            onShare,
            onShareResult,
            onFillProfile,
            onSponsoredClick,
            onViewAnswers
        } = this.props;

        const {
            pictureURL,
            name,
            isPrivate,
            userQuizSession,
            numberOfQuestions,
            timeToPass,
            author,
            isSponsored,
            canAssigneePass,
            numberOfTriesLeft,
            dueTime
        } = activation;

        const { l, ngettext, humanizeDuration, getTimeFromNow } = this.context.i18n;

        if (isLoading) {
            return <Spinner className='ActivationPage__spinner' />;
        }

        const classes = cx('ActivationPage__activation', {
            'ActivationPage__activation--sponsored': isSponsored,
            'ActivationPage__activation--passed': showUserResult
        });

        return (
            <div className={classes}>
                <Card className='ActivationPage__paper' shadow={1}>
                    <CardTitle className='ActivationPage__head'>
                        <img className='ActivationPage__picture' src={pictureURL} />
                        <div className='ActivationPage__info'>
                            <div className='ActivationPage__heading'>
                                <span className='ActivationPage__name'>{name}</span>
                                {
                                    isPrivate
                                    ? <span className='ActivationPage__private-tag'>
                                        <Icon type='lock' className='ActivationPage__lock' />
                                        {l('private')}
                                    </span>
                                    : null
                                }
                            </div>

                            <div className='ActivationPage__author-name'>
                                {author.fullName}
                            </div>

                            <div className='ActivationPage__pass-info'>
                                <span className='ActivationPage__number-of-questions'>
                                    {
                                        sprintf(
                                            ngettext('%d question', '%d questions', numberOfQuestions),
                                            numberOfQuestions
                                        )
                                    }
                                </span>

                                <span className='ActivationPage__span-divider'>
                                    •
                                </span>

                                <span className='ActivationPage__time-to-pass'>
                                    {humanizeDuration(timeToPass, 'second')}
                                </span>

                                {
                                    dueTime
                                    ?   (
                                        <span className='ActivationPage__expires'>
                                            <span className='ActivationPage__span-divider'>
                                                •
                                            </span>
                                            <span>{l('expires ')}{getTimeFromNow(dueTime)}</span>

                                        </span>
                                    )
                                    : null
                                }
                            </div>

                            <div className='ActivationPage__actions'>
                                {
                                    canAssigneePass
                                    ? (
                                        <div className='ActivationPage__pass-btn-wrapper'>
                                            <Button
                                                ripple
                                                raised    = {!isSponsored}
                                                onClick   = {onPass.bind(null, activation)}
                                                className = 'ActivationPage__btn ActivationPage__pass-btn'
                                            >
                                            {l('Pass the test')}
                                            </Button>
                                            {
                                                numberOfTriesLeft
                                                ?
                                                    <div className='ActivationPage__number-of-tries'>
                                                        {l('Number of tries left: ')}{numberOfTriesLeft}
                                                    </div>
                                                :
                                                    null
                                            }
                                        </div>
                                    )
                                    : null
                                }

                                {
                                    isSponsored
                                    ? (
                                        <Button
                                            colored
                                            ripple
                                            raised
                                            onClick={onSponsoredClick.bind(null, activation, this.sponsoredButtonLabel)}
                                            className='ActivationPage__btn ActivationPage__offer-btn'
                                        >
                                            <Icon type='gift' />  {this.sponsoredButtonLabel}
                                        </Button>
                                    )
                                    : null
                                }
                            </div>
                        </div>

                        <div className='ActivationPage__menu'>
                            {
                                !activation.isPrivate
                                ? (
                                    <IconButton
                                        ripple
                                        name    = 'share'
                                        onClick = {onShare.bind(null, activation)}
                                    />
                                )
                                : null
                            }
                        </div>
                    </CardTitle>

                    {
                        showUserResult
                        ?
                            <div className={cx('ActivationPage__results-container', userQuizSession.grade)}>
                                <div className='ActivationPage__overlay'>
                                    <div className='ActivationPage__results-text'>
                                        <h4 className='ActivationPage__greeting'>
                                            {this.getGreetingPhrase(userQuizSession.grade)}
                                        </h4>
                                        <div className='ActivationPage__score'>
                                            {userQuizSession.score}%
                                        </div>
                                        <div className='ActivationPage__points'>
                                            ({
                                                sprintf(
                                                    ngettext(
                                                        '%s of %s point',
                                                        '%s of %s points',
                                                        userQuizSession.maxPoints
                                                    ),
                                                    userQuizSession.gainedPoints,
                                                    userQuizSession.maxPoints
                                                )
                                            })
                                        </div>
                                    </div>
                                    <div className='ActivationPage__results-actions'>
                                        <Button
                                            ripple
                                            raised
                                            onClick   = {onShareResult.bind(null, activation)}
                                            className = 'ActivationPage__result-share-btn'
                                        >
                                            {l('Share result with friends')}
                                        </Button>

                                        {
                                            userQuizSession.canViewAnswers
                                            ?
                                                <Button
                                                    ripple
                                                    onClick   = {onViewAnswers.bind(null, activation)}
                                                    className = 'ActivationPage__result-answers-btn'
                                                >
                                                    {l('View my answers')}
                                                </Button>
                                            : null
                                        }

                                        {
                                            activation.category === 'VACANCY'
                                            ? <div>
                                                <Button
                                                    ripple
                                                    onClick   = {onFillProfile.bind(null, activation)}
                                                    className = 'ActivationPage__fill-profile-btn'
                                                >
                                                    {l('Fill in your resume')}
                                                </Button>
                                                <div className='ActivationPage__tip'>
                                                    {l('Filled profiles receive 70% more views')}
                                                </div>
                                            </div>
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                        : null
                    }

                    <div className='ActivationPage__details'>
                        <ExpandableText text={activation.message} />
                    </div>
                </Card>

                {this.renderSimilarActivations()}
                {this.renderAuthorActivations()}
            </div>
        );
    }

    render() {
        const { l } = this.context.i18n;
        const {
            activation,
            showUserResult,
            sharingLink,
            isLoading,
            isLoggingIn,
            isEmbedded,
            onLoginDialogClose,
            onStopSharing,
            onGoBack
        } = this.props;

        const classes = cx('ActivationPage', {
            'ActivationPage--loading'  : isLoading,
            'ActivationPage--embedded' : isEmbedded
        });

        return (
            <div className={classes}>
                <ShareDialog
                    title          = {l('Share')}
                    isOpen         = {!!sharingLink}
                    twitterMessage = {
                        showUserResult
                        ? sprintf(l('My result is %d%%'), activation.userQuizSession.score)
                        : l('Check out this test')
                    }
                    linkToShare    = {sharingLink}
                    onRequestClose = {onStopSharing}
                />

                <LoginDialog
                    isOpen         = {isLoggingIn}
                    onRequestClose = {onLoginDialogClose}
                />

                <AppBarWithBackground
                    backgroundURL    = {activation.author ? activation.author.backgroundURL : ''}
                    displayRightMenu = {!isEmbedded}
                    rightIconName    = 'arrow_back'
                    onRightIconClick = {onGoBack}
                    title            = {activation.name}
                    height           = {200}
                />

                <div className='ActivationPage__content'>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
