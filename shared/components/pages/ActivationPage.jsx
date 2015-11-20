import React from 'react';

import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import Grid, { Cell }                   from 'react-mdl/lib/Grid';
import Button                           from 'react-mdl/lib/Button';
import IconButton                       from 'react-mdl/lib/IconButton';
import Icon                             from 'react-mdl/lib/Icon';
import QuizTile                         from '../QuizTile.jsx';
import ShareDialog                      from '../ShareDialog.jsx';
import AppBarWithBackground             from '../AppBarWithBackground.jsx';

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

    render() {
        const {activation, isSharing, onPass, onShare, onStopSharing, onActivationClick, onGoBack} = this.props;
        const {l, ngettext, humanizeDuration} = this.context.i18n;

        // TODO : make isLoading prop and display spinner if it is true
        if (!activation.name) {
            return <div />;
        }

        return (
            <div className='ActivationPage'>
                <ShareDialog
                    isOpen         = {isSharing}
                    linkToShare    = {activation.publicLink}
                    onRequestClose = {onStopSharing}
                />

                <AppBarWithBackground
                    backgroundURL    = {activation.backgroundURL}
                    rightIconName    = 'arrow_back'
                    onRightIconClick = {onGoBack}
                    title            = {activation.name}
                    height           = {200}
                />

                <div className='ActivationPage__content'>
                    <Card className='ActivationPage__Paper' shadow={1}>
                        <CardTitle className='ActivationPage__head'>
                            <img className='ActivationPage__picture' src={activation.pictureURL} />
                            <div className='ActivationPage__info'>
                                <div className='ActivationPage__name'>
                                    {activation.name}
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
                                <IconButton
                                    name    = 'share'
                                    ripple  = {true}
                                    onClick = {onShare}
                                />
                            </div>
                        </CardTitle>

                        <div className='ActivationPage__details'>
                            <p className='ActivationPage__message'>
                                {activation.message}
                            </p>
                        </div>
                    </Card>

                    <div className='ActivationPage__subheader'>
                        {
                            sprintf(
                                l('More tests by %s'),
                                activation.author.fullName
                            )
                        }
                    </div>
                    <Grid className='ActivationPage__author-activations-grid'>
                    {
                        activation.authorActivations.map((authorActivation, i) =>
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
            </div>
        );
    }
}

