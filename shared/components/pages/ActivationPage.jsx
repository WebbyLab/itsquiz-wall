import React from 'react';
import cx    from 'classnames';

import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import Grid, { Cell }                   from 'react-mdl/lib/Grid';
import Button                           from 'react-mdl/lib/Button';
import IconButton                       from 'react-mdl/lib/IconButton';
import Spinner                          from 'react-mdl/lib/Spinner';

import QuizTile             from '../QuizTile.jsx';
import Icon                 from '../Icon.jsx';
import ShareDialog          from '../../containers/ShareDialog.jsx';
import AppBarWithBackground from '../AppBarWithBackground.jsx';

import { sprintf } from '../../utils';

if ( process.env.BROWSER ) {
    require('./ActivationPage.less');
}

export default class ActivationPage extends React.Component {
    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
        activation        : React.PropTypes.object,
        onPass            : React.PropTypes.func,
        onActivationClick : React.PropTypes.func
    };

    renderContent = () => {
        const {
            activation,
            authorActivations,
            isLoading,
            onPass,
            onShare,
            onStopSharing,
            onActivationClick
        } = this.props;

        const {l, ngettext, humanizeDuration} = this.context.i18n;

        if (isLoading) {
            return <Spinner className='ActivationPage__spinner' />;
        }

        return (
            <div className='ActivationPage__activation'>
                <Card className='ActivationPage__paper' shadow={1}>
                    <CardTitle className='ActivationPage__head'>
                        <img className='ActivationPage__picture' src={activation.pictureURL} />
                        <div className='ActivationPage__info'>
                            <div className='ActivationPage__heading'>
                                <span className='ActivationPage__name'>{activation.name}</span>
                                {
                                    activation.isPrivate
                                    ? <span className='ActivationPage__private-tag'>
                                        <Icon type='lock' className='ActivationPage__lock' />
                                        {l('private')}
                                    </span>
                                    : null
                                }
                            </div>

                            <div className='ActivationPage__author-name'>
                                {activation.author.fullName}
                            </div>

                            <div className='ActivationPage__pass-info'>
                                <span className='ActivationPage__number-of-questions'>
                                    {
                                        sprintf(
                                            ngettext('%d question', '%d questions', activation.numberOfQuestions),
                                            activation.numberOfQuestions
                                        )
                                    }
                                </span>

                                <span className='ActivationPage__span-divider'>
                                    •
                                </span>

                                <span className='ActivationPage__time-to-pass'>
                                    { humanizeDuration(activation.timeToPass, 'second') }
                                </span>
                            </div>

                            <div className='ActivationPage__actions'>
                                <Button
                                    colored   = {true}
                                    ripple    = {true}
                                    onClick   = {onPass.bind(null, activation)}
                                    className = 'ActivationPage__pass-btn'
                                    raised    = {true}>
                                    {l('Pass this test')}
                                </Button>
                            </div>
                        </div>

                        <div className='ActivationPage__menu'>
                            {
                                !activation.isPrivate
                                ? <IconButton
                                    name    = 'share'
                                    ripple  = {true}
                                    onClick = {onShare}
                                />
                                : null
                            }
                        </div>
                    </CardTitle>

                    <div className='ActivationPage__details'>
                        <p className='ActivationPage__message'>
                            {activation.message}
                        </p>
                    </div>
                </Card>

                {
                    authorActivations.length !== 0
                    ? <div className='ActivationPage__subheader'>
                        {sprintf(l('More tests by %s'), activation.author.fullName)}
                    </div>
                    : null
                }

                <Grid className='ActivationPage__author-activations-grid'>
                {
                    authorActivations.map((authorActivation, i) =>
                        <Cell
                            key    = {authorActivation.id}
                            align  = 'stretch'
                            col    = {3}
                            phone  = {2}
                            tablet = {3}>
                            <QuizTile
                                id                = {authorActivation.id}
                                name              = {authorActivation.name}
                                timeToPass        = {authorActivation.timeToPass}
                                numberOfQuestions = {authorActivation.numberOfQuestions}
                                pictureURL        = {authorActivation.pictureURL}
                                author            = {activation.author}
                                onClick           = {onActivationClick.bind(null, authorActivation)}
                            />
                        </Cell>
                    )
                }
                </Grid>
            </div>
        );
    }

    render() {
        const {
            activation,
            isSharing,
            isLoading,
            isEmbedded,
            onShare,
            onStopSharing,
            onLogin,
            onGoBack
        } = this.props;

        const classes = cx('ActivationPage', {
            'ActivationPage--loading'  : isLoading,
            'ActivationPage--embedded' : isEmbedded
        });

        return (
            <div className={classes}>
                <ShareDialog
                    isOpen         = {isSharing}
                    linkToShare    = {activation.publicLink}
                    onRequestClose = {onStopSharing}
                />

                <AppBarWithBackground
                    backgroundURL    = {activation.backgroundURL}
                    displayRightMenu = {!isEmbedded}
                    rightIconName    = 'arrow_back'
                    onRightIconClick = {onGoBack}
                    title            = {activation.name}
                    onLogin          = {onLogin}
                    height           = {200}
                />

                <div className='ActivationPage__content'>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}

