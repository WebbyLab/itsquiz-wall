import React from 'react'
import PropTypes from 'prop-types';
import cx    from 'classnames';

import { Tab, Tabs } from 'react-mdl/lib/Tabs';
import ReactList     from 'react-list';
import { Card }      from 'react-mdl/lib/Card';
import Spinner       from 'react-mdl/lib/Spinner';
import Button        from 'react-mdl/lib/Button';

import QuizCard    from '../QuizCard.jsx';
import AppBar      from '../AppBar.jsx';
import ShareDialog from '../../containers/ShareDialog.jsx';
import LoginDialog from '../../containers/LoginDialog.jsx';
import Icon        from '../Icon.jsx';

import './ActivationsPage.less';

const CATEGORIES = ['ALL', 'VACANCY', 'EDUCATION', 'ENTERTAINMENT', 'SPECIAL'];

export default class ActivationsPage extends React.Component {
    static propTypes = {
        activations            : PropTypes.arrayOf(PropTypes.object),
        search                 : PropTypes.string,
        totalActivationsAmount : PropTypes.number,
        sortType               : PropTypes.string,
        selectedCategory       : PropTypes.string,
        linkToShare            : PropTypes.string,
        isLoading              : PropTypes.bool,
        isEmpty                : PropTypes.bool,
        isSharing              : PropTypes.bool,
        isEmbedded             : PropTypes.bool,
        isLoggingIn            : PropTypes.bool,
        onSearch               : PropTypes.func,
        onSpecialsSubscribe    : PropTypes.func,
        onChangeSortType       : PropTypes.func,
        onTabChange            : PropTypes.func,
        onLoginClose           : PropTypes.func,
        onStopSharing          : PropTypes.func,
        onItemClick            : PropTypes.func,
        onSubscribe            : PropTypes.func,
        onShare                : PropTypes.func,
        onItemRenderRequest    : PropTypes.func,
        onAuthorAvatarClick    : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    handleTabClick = (index, e) => {
        e.preventDefault();

        this.props.onTabChange(CATEGORIES[index]);
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
                accountQuizSession     = {activation.accountQuizSession}
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

    renderContent = () => {
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
            onStopSharing
        } = this.props;

        const { l } = this.context.i18n;

        const classes = cx('ActivationsPage', {
            'ActivationsPage--embedded' : isEmbedded,
            'ActivationsPage--loading'  : isLoading
        });

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
                                activeTab = {selectedCategory ? CATEGORIES.indexOf(selectedCategory) : 0}
                                className = 'ActivationsPage__tabs'
                            >
                                <Tab
                                    className = 'ActivationsPage__all-tab'
                                    href      = '/activations'
                                    onClick   = {this.handleTabClick.bind(null, 0)}
                                >
                                    <span className='ActivationsPage__tab-text'>{l('All tests')}</span>
                                    <Icon className='ActivationsPage__tab-icon' type='star-circle' />
                                </Tab>
                                <Tab
                                    className = 'ActivationsPage__vacancy-tab'
                                    href      = '/activations?category=vacancy'
                                    onClick   = {this.handleTabClick.bind(null, 1)}
                                >
                                    <span className='ActivationsPage__tab-text'>{l('Vacancies')}</span>
                                    <Icon className='ActivationsPage__tab-icon' type='briefcase' />
                                </Tab>
                                <Tab
                                    className = 'ActivationsPage__education-tab'
                                    href      = '/activations?category=education'
                                    onClick   = {this.handleTabClick.bind(null, 2)}
                                >
                                    <span className='ActivationsPage__tab-text'>{l('Education')}</span>
                                    <Icon className='ActivationsPage__tab-icon' type='school' />
                                </Tab>
                                <Tab
                                    className = 'ActivationsPage__entertainment-tab'
                                    href      = '/activations?category=entertainment'
                                    onClick   = {this.handleTabClick.bind(null, 3)}
                                >
                                    <span className='ActivationsPage__tab-text'>{l('Entertainment')}</span>
                                    <Icon className='ActivationsPage__tab-icon' type='google-controller' />
                                </Tab>
                                <Tab
                                    className = 'ActivationsPage__special-tab'
                                    href      = '/activations?category=special'
                                    onClick   = {this.handleTabClick.bind(null, 4)}
                                >
                                    <Icon type='gift' />  {l('Special offer')}
                                </Tab>
                            </Tabs>

                            <select
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
                            </select>
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
