import React, { PropTypes } from 'react';
import cx                   from 'classnames';

import { Card, CardTitle }  from 'react-mdl/lib/Card';
import Grid                 from 'react-mdl/lib/Grid';
import Button               from 'react-mdl/lib/Button';
import Spinner              from 'react-mdl/lib/Spinner';

import ShareDialog          from '../../containers/ShareDialog.jsx';
import LoginDialog          from '../../containers/LoginDialog.jsx';
import AppBarWithBackground from '../AppBarWithBackground.jsx';
import ExpandableText       from '../ExpandableText.jsx';
import QuizCard             from '../QuizCard.jsx';

import { sprintf }          from '../../utils';

import './ActivationPage.less';

export default class ActivationPage extends React.Component {
    static propTypes = {
        account                      : PropTypes.object,
        authorActivations            : PropTypes.arrayOf(PropTypes.object),
        isLoading                    : PropTypes.bool,
        isLoadingAuthorActivations   : PropTypes.bool,
        isAllAuthorActivationsLoaded : PropTypes.bool,
        isSharing                    : PropTypes.bool,
        isLoggingIn                  : PropTypes.bool,
        isEmbedded                   : PropTypes.bool,
        onGoBack                     : PropTypes.func,
        onActivationClick            : PropTypes.func,
        onLoadAllAuthorActivations   : PropTypes.func,
        onStopSharing                : PropTypes.func,
        onShare                      : PropTypes.func,
        onAuthorAvatarClick          : PropTypes.func,
        onLoginClose                 : PropTypes.func,
        linkToShare                  : PropTypes.string
    };

    static contextTypes = { i18n: PropTypes.object };

    handleActivationClick = (activation) => {
        this.props.onActivationClick(activation);
    };

    renderAuthorActivations = () => {
        const {
            account,
            authorActivations,
            isAllAuthorActivationsLoaded,
            isLoadingAuthorActivations,
            onLoadAllAuthorActivations,
            isSharing,
            linkToShare,
            onStopSharing,
            onShare,
            onAuthorAvatarClick,
            isLoggingIn,
            onLoginClose
        } = this.props;

        const { l } = this.context.i18n;

        if (authorActivations && authorActivations.length) {
            return (
                <div className='ActivationPage__author-activations'>

                    <ShareDialog
                        title          = {l('Share this test')}
                        isOpen         = {isSharing}
                        linkToShare    = {linkToShare}
                        onRequestClose = {onStopSharing}
                    />

                    <LoginDialog
                        isOpen         = {isLoggingIn}
                        onRequestClose = {onLoginClose}
                    />

                    <div className='ActivationPage__subheader'>
                        {sprintf(l('More tests by %s'), account.fullName)}
                    </div>

                    <Grid className='ActivationPage__author-activations-grid'>
                        {
                            authorActivations.map(authorActivation =>
                                <QuizCard
                                    id                  = {authorActivation.id}
                                    key                 = {authorActivation.id}
                                    author              = {account}
                                    className           = 'ActivationsPage__quiz-card'
                                    name                = {authorActivation.name}
                                    message             = {authorActivation.message}
                                    numberOfQuestions   = {authorActivation.numberOfQuestions}
                                    timeToPass          = {authorActivation.timeToPass}
                                    accountQuizSession  = {authorActivation.accountQuizSession}
                                    pictureURL          = {authorActivation.pictureURL}
                                    category            = {authorActivation.category}
                                    onShare             = {onShare.bind(this, authorActivation)}
                                    onClick             = {this.handleActivationClick.bind(null, authorActivation)}
                                    onAuthorAvatarClick = {onAuthorAvatarClick}
                                />)
                        }
                    </Grid>

                    {
                        isLoadingAuthorActivations
                        ?
                            <Spinner className='ActivationPage__author-activations-spinner' />
                        :
                            null
                    }

                    {
                        !isAllAuthorActivationsLoaded
                        ?
                            <Button ripple raised
                                className = 'ActivationPage__load-more-btn'
                                onClick   = {onLoadAllAuthorActivations(account.id)}
                            >
                                {l('Load more')}
                            </Button>
                        :
                            null
                    }
                </div>
            );
        }

        return null;
    };

    renderContent = () => {
        const {
            account,
            isLoading
        } = this.props;

        const {
            avatar,
            fullName,
            statusMessage
        } = account;

        const {  nl } = this.context.i18n;

        if (isLoading) {
            return <Spinner className='ActivationPage__spinner' />;
        }

        return (
            <div className='ActivationPage__activation'>
                <Card className='ActivationPage__paper AccountPage__paper' shadow={1}>
                    <CardTitle className='ActivationPage__head'>
                        <img className='ActivationPage__picture' src={avatar} />
                        <div className='ActivationPage__info'>
                            <div className='ActivationPage__heading'>
                                <span className='ActivationPage__name'>{fullName}</span>
                            </div>

                            <div className='ActivationPage__author-name'>
                                {statusMessage}
                            </div>

                            <div className='ActivationPage__pass-info'>
                                <span className='ActivationPage__number-of-questions'>
                                    {
                                        sprintf(
                                            nl('%d test', '%d tests', account.activations.length),
                                            account.activations.length
                                        )
                                    }
                                </span>
                            </div>
                            <div className='ActivationPage__actions' />
                        </div>
                    </CardTitle>

                    <div className='ActivationPage__details'>
                        <ExpandableText
                            isMarkdownEnabled
                            text={account.summary}
                            markdownPreset='activationDescription'
                        />
                    </div>
                </Card>

                {this.renderAuthorActivations()}
            </div>
        );
    }

    render() {
        const {
            account,
            isLoading,
            onGoBack,
            isEmbedded
        } = this.props;

        const classes = cx('ActivationPage', {
            'ActivationPage--loading'  : isLoading,
            'ActivationPage--embedded' : isEmbedded
        });

        return (
            <div className={classes}>

                <AppBarWithBackground
                    backgroundURL    = {account ? account.backgroundURL : ''}
                    rightIconName    = 'arrow_back'
                    title            = {account.fullName}
                    displayRightMenu = {!isEmbedded}
                    height           = {200}
                    isOrganization   = {account.type === 'ORGANIZATION'}
                    hideGoBackBtn    = {false}
                    onRightIconClick = {onGoBack}
                />

                <div className='ActivationPage__content AccountPage__content'>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
