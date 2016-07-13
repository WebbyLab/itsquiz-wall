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
import ScoreCircle          from '../../containers/other/ScoreCircle.jsx';

import { sprintf } from '../../utils';

import './ActivationPage.less';

export default class ActivationPage extends React.Component {
    static propTypes = {
        activation         : React.PropTypes.object,
        authorActivations  : React.PropTypes.arrayOf(React.PropTypes.object),
        similarActivations : React.PropTypes.arrayOf(React.PropTypes.object),
        showUserResult     : React.PropTypes.bool,
        sharingLink        : React.PropTypes.string,
        userQuizSession    : React.PropTypes.object,
        isLoading          : React.PropTypes.bool,
        isLoggingIn        : React.PropTypes.bool,
        isEmbedded         : React.PropTypes.bool,
        dueTime            : React.PropTypes.string,
        assessmentSystem   : React.PropTypes.array,
        onPass             : React.PropTypes.func,
        onShare            : React.PropTypes.func,
        onShareComplete    : React.PropTypes.func,
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

    state = {
        showDescription: false
    };

    componentWillMount() {
        const { l } = this.context.i18n;

        this.sponsoredButtonLabel = Math.random() < 0.5 ? l('Contact me') : l('Get the gift');
    }

    handleDescriptionClick = () => {
        this.setState({
            showDescription: true
        });
    };

    handleHideDescription = () => {
        this.setState({
            showDescription: false
        });
    };

    getGreeting = (score) => {
        const { l } = this.context.i18n;

        const assessmentSystem = this.props.assessmentSystem;

        if (assessmentSystem.length === 0) {
            if (score > 95) {
                return { phrase: l('You rock! Excellent job!') };
            }

            if (score > 75) {
                return { phrase: l('Great result!') };
            }

            if (score > 50) {
                return { phrase: l('Good job!') };
            }

            if (score > 30) {
                return { phrase: l('You could do better!') };
            }

            return { phrase: l('You could do better!') };
        }

        for (let i = assessmentSystem.length - 1; i >= 0; i--) {
            if (score >= assessmentSystem[i].grade) {
                return {
                    phrase: assessmentSystem[i].phrase,
                    description: assessmentSystem[i].description || ''
                };
            }
        }
    };

    renderAuthorActivations = () => {
        const {
            activation,
            authorActivations,
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
                                    isPassed          = {Boolean(authorActivation.isPassed)}
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
                                    isPassed          = {similarActivation.isPassed}
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

    renderPassButton = (options) => {
        const alreadyPassed = options ? options.alreadyPassed : null;

        const {
            activation,
            onPass
        } = this.props;

        const {
            isSponsored,
            numberOfTriesLeft
        } = activation;

        const {
            l,
            nl
        } = this.context.i18n;

        return (
            <div className='ActivationPage__pass-btn-wrapper'>
                <Button
                    ripple
                    raised    = {!isSponsored}
                    onClick   = {onPass.bind(null, activation)}
                    className = {
                        !alreadyPassed
                        ?
                            'ActivationPage__btn ActivationPage__pass-btn'
                        :
                            'ActivationPage__btn ActivationPage__pass-btn-already-passed'
                    }
                >
                    {
                        !alreadyPassed
                        ?
                            l('Pass the test')
                        :
                            l('Improve result')
                    }
                </Button>
                {
                    numberOfTriesLeft
                    ?
                        <div className='ActivationPage__number-of-tries'>
                            {
                                sprintf(
                                    nl('You have %d try left',
                                        'You have %d tries left', numberOfTriesLeft),
                                    numberOfTriesLeft
                                )
                            }
                        </div>
                    :
                        null
                }
            </div>
        );
    }

    renderContent = () => {
        const {
            activation,
            isLoading,
            showUserResult,
            isEmbedded,
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
            dueTime,
            canAssigneeViewQuestions
        } = activation;

        const { l, nl, humanizeDuration, getTimeFromNow } = this.context.i18n;

        const isPassingBtnAvailable = isEmbedded ? canAssigneePass : true;

        const greeting = showUserResult ? this.getGreeting(userQuizSession.score).phrase : '';
        const greetingDescription = showUserResult ? this.getGreeting(userQuizSession.score).description : '';

        if (isLoading) {
            return <Spinner className='ActivationPage__spinner' />;
        }

        const classes = cx('ActivationPage__activation', {
            'ActivationPage__activation--sponsored': isSponsored,
            'ActivationPage__activation--passed': showUserResult
        });

        const passInfoClasses = cx('ActivationPage__pass-info', { 'ActivationPage__pass-info--expires': dueTime });

        const settingsIconsClasses = cx('ActivationPage__settings-icons--indented', {
            'ActivationPage__settings-icons--on'  : canAssigneeViewQuestions,
            'ActivationPage__settings-icons--off' : !canAssigneeViewQuestions
        });

        return (
            <div className={classes}>
                <Card className='ActivationPage__paper' shadow={1}>
                    <CardTitle className='ActivationPage__head'>
                        <img className='ActivationPage__picture' src={pictureURL} />
                        <div className='ActivationPage__head-mobile'>
                            <div className='ActivationPage__circle-result'>
                                <ScoreCircle
                                    value={userQuizSession.score}
                                    size={200}
                                />
                            </div>
                            <div className='ActivationPage__result-share'>
                                <Button
                                    ripple
                                    raised
                                    onClick   = {onShareResult.bind(null, activation)}
                                    className = 'ActivationPage__result-share-btn'
                                >
                                    {l('Share result')}
                                </Button>
                            </div>
                        </div>
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

                            <div className='ActivationPage__quiz_summary'>
                                <div className='ActivationPage__author-name'>
                                    {author.fullName}
                                </div>

                                <div className={passInfoClasses}>
                                    <span className='ActivationPage__number-of-questions'>
                                        {
                                            sprintf(
                                                nl('%d question', '%d questions', numberOfQuestions),
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
                                                <span>{sprintf(l('expires %s'), getTimeFromNow(dueTime))}</span>

                                            </span>
                                        )
                                        : null
                                    }

                                    <div className='ActivationPage__settings-icons'>
                                        <Icon
                                            title={canAssigneeViewQuestions
                                                ? l('You can view answers')
                                                : l('Author disallowed to view answers')}
                                            type='eye'
                                            size={16}
                                            className={settingsIconsClasses}
                                        />
                                        <Icon
                                            title={l('You can contact the author')}
                                            type='message'
                                            size={16}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='ActivationPage__actions'>
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

                                {
                                    isPassingBtnAvailable && !userQuizSession
                                    ?
                                        this.renderPassButton()
                                    :
                                        <Button
                                            ripple
                                            raised
                                            onClick   = {onShareResult.bind(null, activation)}
                                            className = 'ActivationPage__result-share-btn'
                                        >
                                            {l('Share result with friends')}
                                        </Button>
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
                            <div className={cx('ActivationPage__results-container', userQuizSession.resultBackground)}>
                                <div className='ActivationPage__overlay'>
                                    <div className='ActivationPage__results-text'>

                                        <h4 className='ActivationPage__greeting'>
                                            {greeting}
                                        </h4>

                                        <div className='ActivationPage__score'>
                                            {userQuizSession.score}%
                                        </div>
                                        <div className='ActivationPage__points'>
                                            ({
                                                sprintf(
                                                    nl(
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
                                        {
                                            isPassingBtnAvailable && userQuizSession
                                            ? this.renderPassButton({ alreadyPassed: true })
                                            : null
                                        }

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
                        <ExpandableText
                            isMarkdownEnabled
                            text={greetingDescription || activation.message}
                            markdownPreset='activationDescription'
                        />
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
                    onShare        = {this.props.onShareComplete}
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
