import React         from 'react';
import cx            from 'classnames';

import { Tab, Tabs } from 'react-mdl/lib/Tabs';
import ReactList     from 'react-list';
import { Card }      from 'react-mdl/lib/Card';
import Spinner       from 'react-mdl/lib/Spinner';
import Button        from 'react-mdl/lib/Button';

import QuizCard      from '../QuizCard.jsx';
import AppBar        from '../AppBar.jsx';
import AccountCard   from '../AccountCard.jsx';
import ShareDialog   from '../../containers/ShareDialog.jsx';
import LoginDialog   from '../../containers/LoginDialog.jsx';
import Icon          from '../Icon.jsx';

import './ActivationsPage.less';


// const CATEGORIES = ['ALL', 'VACANCY', 'EDUCATION', 'ENTERTAINMENT', 'SPECIAL'];
// const VIEW_MODE_TYPES = ['ORGANIZATION', 'USER', 'ACTIVATION'];
const VIEW_MODE_TYPES = ['USER', 'ACTIVATION'];

export default class ActivationsPage extends React.Component {
    static propTypes = {
        activations                : React.PropTypes.arrayOf(React.PropTypes.object),
        accounts                   : React.PropTypes.arrayOf(React.PropTypes.object),
        search                     : React.PropTypes.string,
        totalActivationsAmount     : React.PropTypes.number,
        sortType                   : React.PropTypes.string,
        selectedCategory           : React.PropTypes.string,
        linkToShare                : React.PropTypes.string,
        modeForView                : React.PropTypes.string,
        isLoading                  : React.PropTypes.bool,
        isEmpty                    : React.PropTypes.bool,
        isSharing                  : React.PropTypes.bool,
        isEmbedded                 : React.PropTypes.bool,
        isLoggingIn                : React.PropTypes.bool,
        onSearch                   : React.PropTypes.func,
        onSpecialsSubscribe        : React.PropTypes.func,
        onChangeSortType           : React.PropTypes.func,
        onTabChange                : React.PropTypes.func,
        onLoginClose               : React.PropTypes.func,
        onStopSharing              : React.PropTypes.func,
        onItemClick                : React.PropTypes.func,
        onSubscribe                : React.PropTypes.func,
        onShare                    : React.PropTypes.func,
        onItemRenderRequest        : React.PropTypes.func,
        onAccountsItemRenderRequest: React.PropTypes.func,
        onAccountsItemClick        : React.PropTypes.func,
        onAuthorAvatarClick        : React.PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    handleTabClick = (index, e) => {
        e.preventDefault();

        this.props.onTabChange(VIEW_MODE_TYPES[index].toLowerCase());
    };

    renderQuizItem = (index, key) => {
        const {
            activations,
            onShare,
            onItemClick,
            onAuthorAvatarClick,
            onItemRenderRequest
        } = this.props;

        const activation = activations[index];

        const isSurvey = activation.accountQuizSession ? activation.accountQuizSession.maxPoints === 0 : false;

        onItemRenderRequest(index);

        if (!activation) {
            return (
                <Card className='ActivationsPage__loading-card' key={key}>
                    <Spinner className='ActivationsPage__card-spinner' />
                </Card>
            );
        }

        return (
            <QuizCard
                id                  = {activation.id}
                key                 = {key}
                className           = 'ActivationsPage__quiz-card'
                name                = {activation.name}
                message             = {activation.message}
                numberOfQuestions   = {activation.numberOfQuestions}
                timeToPass          = {activation.timeToPass}
                accountQuizSession  = {activation.accountQuizSession}
                pictureURL          = {activation.pictureURL}
                author              = {activation.author}
                category            = {activation.category}
                isSponsored         = {activation.isSponsored}
                isPassed            = {Boolean(activation.isPassed)}
                isSurvey            = {isSurvey}
                onShare             = {onShare.bind(this, activation)}
                onClick             = {onItemClick.bind(this, activation)}
                onAuthorAvatarClick = {onAuthorAvatarClick}
            />
        );
    };

    renderQuizItemsGrid = (items, ref) => {
        return (
            <div className='ActivationsPage__grid-container'>
                <div className='ActivationsPage__grid' ref={ref}>
                    {items}
                </div>
            </div>
        );
    };

    renderAccountItem = (index, key) => {
        const {
            onAccountsItemClick,
            onAccountsItemRenderRequest,
            accounts
        } = this.props;

        const accountsToRenderByType = accounts.entitiesByType[accounts.viewMode] || [];

        const account = accountsToRenderByType[index];

        onAccountsItemRenderRequest(index);

        if (!account) {
            return (
                <Card className='ActivationsPage__loading-card' key={key}>
                    <Spinner className='ActivationsPage__card-spinner' />
                </Card>
            );
        }

        return (
            <AccountCard
                className           = 'ActivationsPage__quiz-card'
                key                 = {key}
                account             = {account}
                onClick             = {onAccountsItemClick.bind(this, account)}
            />
        );
    };

    renderAccountItemsGrid = (items, ref) => {
        return (
            <div className='ActivationsPage__grid-container'>
                <div className='ActivationsPage__grid' ref={ref}>
                    {items}
                </div>
            </div>
        );
    };

    renderActivationsContent = () => {
        const { l } = this.context.i18n;

        const {
            activations,
            totalActivationsAmount,
            search,
            isLoading,
            isEmpty
        } = this.props;

        if (isLoading) {
            return <Spinner className='ActivationsPage__spinner' />;
        }

        if (isEmpty && search) {
            return (
                <div className='ActivationsPage__empty-state'>
                    {l('Sorry, we couldn\'t find any tests for ')} <strong> {search} </strong>
                </div>
            );
        }

        if (isEmpty) {
            return (
                <div className='ActivationsPage__empty-state'>
                    {l('There are no activations in this category yet')}
                </div>
            );
        }

        return (
            <div className='ActivationsPage__activations'>
                <ReactList
                    itemRenderer={this.renderQuizItem}
                    itemsRenderer={this.renderQuizItemsGrid}
                    length={activations.length}
                    pageSize={24}
                    type='simple'
                />

                {
                    activations.length < totalActivationsAmount
                    ? <div className='ActivationsPage__loading-next-spinner-container'>
                        <Spinner className='ActivationsPage__loading-next-spinner' />
                    </div>
                    : null
                }
            </div>
        );
    }

    renderAccountsContent = () => {
        const { l } = this.context.i18n;

        const {
            accounts,
            search
        } = this.props;

        const accountsToRenderByType = accounts.entitiesByType[accounts.viewMode] || [];
        const isEmpty = accountsToRenderByType.length === 0;

        if (accounts.isLoading) {
            return <Spinner className='ActivationsPage__spinner' />;
        }

        if (isEmpty && search) {
            return (
                <div className='ActivationsPage__empty-state'>
                    {l('Sorry, we couldn\'t find any tests for ')} <strong> {search} </strong>
                </div>
            );
        }

        if (isEmpty) {
            return (
                <div className='ActivationsPage__empty-state'>
                    {l('There are no activations in this category yet')}
                </div>
            );
        }

        return (
            <div className='ActivationsPage__activations'>
                <ReactList
                    itemRenderer={this.renderAccountItem}
                    itemsRenderer={this.renderAccountItemsGrid}
                    length={accountsToRenderByType.length}
                    pageSize={24}
                    type='simple'
                />

                {
                    accountsToRenderByType.length < accounts.totalAccountsAmount
                    ? <div className='ActivationsPage__loading-next-spinner-container'>
                        <Spinner className='ActivationsPage__loading-next-spinner' />
                    </div>
                    : null
                }
            </div>
        );
    }

    renderContent = () => {
        const { modeForView } = this.props;
        const isRenderActivationsContent = modeForView ? (modeForView.toUpperCase() === VIEW_MODE_TYPES[1]) : false;

        return isRenderActivationsContent
            ? this.renderActivationsContent()
            : this.renderAccountsContent();
    };

    render() {
        const {
            search,
            sortType,
            selectedCategory,
            isSharing,
            isEmbedded,
            isLoggingIn,
            isLoading,
            linkToShare,
            onSearch,
            onSpecialsSubscribe,
            onChangeSortType,
            onLoginClose,
            onStopSharing,
            modeForView
        } = this.props;

        const { l } = this.context.i18n;

        const classes = cx('ActivationsPage', {
            'ActivationsPage--embedded' : isEmbedded,
            'ActivationsPage--loading'  : isLoading
        });

        const activeTab =   modeForView
            ? VIEW_MODE_TYPES.indexOf(modeForView.toUpperCase())
            : 0;

        return (
            <div className={classes}>
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

                <div className='ActivationsPage__header'>
                    <AppBar
                        displaySearch
                        title         = {l('Quizzes')}
                        search        = {search}
                        className     = 'ActivationsPage__app-bar'
                        fixOnScroll   = {false}
                        scrollOffset  = {65}
                        onSearch      = {onSearch}
                    />

                    <div className='ActivationsPage__toolbar-container'>
                        <div className='ActivationsPage__toolbar'>
                            <Tabs
                                ripple
                                activeTab = {activeTab}
                                className = 'ActivationsPage__tabs'
                            >
                                {/* <Tab
                                    className       = 'ActivationsPage__all-tab'
                                    href            = '/activations?viewMode=organization'
                                    onClick         = {this.handleTabClick.bind(null, 0)}
                                >
                                    <span className = 'ActivationsPage__tab-text'>{l('ORGANIZATIONS')}</span>
                                    <Icon className = 'ActivationsPage__tab-icon' type = 'star-circle' />
                                </Tab> */}
                                <Tab
                                    className       = 'ActivationsPage__all-tab'
                                    href            = '/activations?viewMode=user'
                                    onClick         = {this.handleTabClick.bind(null, 0)}
                                >
                                    <span className = 'ActivationsPage__tab-text'>{l('Users')}</span>
                                    <Icon className = 'ActivationsPage__tab-icon' type = 'account-circle' />
                                </Tab>
                                <Tab
                                    className = 'ActivationsPage__all-tab'
                                    href      = '/activations?viewMode=activation'
                                    onClick   = {this.handleTabClick.bind(null, 1)}
                                >
                                    <span className='ActivationsPage__tab-text'>{l('All tests')}</span>
                                    <Icon className='ActivationsPage__tab-icon' type='star-circle' />
                                </Tab>
                            </Tabs>

                            {(activeTab === 1)
                            && <select
                                value={sortType}
                                onChange={onChangeSortType}
                                className='ActivationPage__select'
                               >
                                <option value='new'>
                                    {l('Newest first')}
                                </option>

                                <option value='popular'>
                                    {l('Popular first')}
                                </option>
                            </select>}
                        </div>
                    </div>
                </div>

                <div className='ActivationsPage__content'>
                    {
                        selectedCategory === 'SPECIAL' && !isEmbedded
                        ?
                            <Button colored raised ripple
                                className='ActivationsPage__subscribe-btn'
                                onClick={onSpecialsSubscribe}
                            >
                                {l('I want to receive new special offers')}
                            </Button>
                        :
                            null

                    }

                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
