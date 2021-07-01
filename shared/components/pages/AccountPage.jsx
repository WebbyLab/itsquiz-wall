import React, { PropTypes } from 'react';
import cx from 'classnames';

import { Card, CardTitle } from 'react-mdl/lib/Card';
import Grid, { Cell }      from 'react-mdl/lib/Grid';
import Button              from 'react-mdl/lib/Button';
import Spinner             from 'react-mdl/lib/Spinner';

import QuizTile             from '../QuizTile.jsx';
import AppBarWithBackground from '../AppBarWithBackground.jsx';
import ExpandableText       from '../ExpandableText.jsx';

import { sprintf } from '../../utils';

import './ActivationPage.less';

export default class ActivationPage extends React.Component {
    static propTypes = {
        account                      : PropTypes.object,
        authorActivations            : PropTypes.arrayOf(PropTypes.object),
        isLoading                    : PropTypes.bool,
        isLoadingAuthorActivations   : PropTypes.bool,
        isAllAuthorActivationsLoaded : PropTypes.bool,
        onGoBack                     : PropTypes.func,
        onActivationClick            : PropTypes.func,
        onLoadAllAuthorActivations   : PropTypes.func
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
            onLoadAllAuthorActivations
        } = this.props;

        const { l } = this.context.i18n;

        if (authorActivations && authorActivations.length) {
            return (
                <div className='ActivationPage__author-activations'>
                    <div className='ActivationPage__subheader'>
                        {sprintf(l('More tests by %s'), account.fullName)}
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
                                        author            = {account}
                                        isPassed          = {Boolean(authorActivation.isPassed)}
                                        accountQuizSession   = {authorActivation.accountQuizSession}
                                        onClick           = {this.handleActivationClick.bind(null, authorActivation)}
                                    />
                                </Cell>
                            )
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
            fullName
        } = account;

        const {  nl } = this.context.i18n;

        if (isLoading) {
            return <Spinner className='ActivationPage__spinner' />;
        }

        return (
            <div className='ActivationPage__activation'>
                <Card className='ActivationPage__paper' shadow={1}>
                    <CardTitle className='ActivationPage__head'>
                        <img className='ActivationPage__picture' src={avatar} />
                        <div className='ActivationPage__info'>
                            <div className='ActivationPage__heading'>
                                <span className='ActivationPage__name'>{fullName}</span>
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
            onGoBack
        } = this.props;

        const classes = cx('ActivationPage', {
            'ActivationPage--loading'  : isLoading
        });

        return (
            <div className={classes}>

                <AppBarWithBackground
                    displayRightMenu
                    backgroundURL    = {account ? account.backgroundURL : ''}
                    rightIconName    = 'arrow_back'
                    title            = {account.fullName}
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
