import React from 'react';
import cx    from 'classnames';

import { Tab, Tabs }  from 'react-mdl/lib/Tabs';
import ReactList      from 'react-list';
import { Card }           from 'react-mdl/lib/Card';
import Spinner        from 'react-mdl/lib/Spinner';
import Button         from 'react-mdl/lib/Button';

import QuizCard    from '../QuizCard.jsx';
import AppBar      from '../AppBar.jsx';
import ShareDialog from '../../containers/ShareDialog.jsx';
import LoginDialog from '../../containers/LoginDialog.jsx';
import Icon        from '../Icon.jsx';

if ( process.env.BROWSER ) {
    require('./ActivationsPage.less');
}

const CATEGORIES = ['ALL', 'VACANCY', 'EDUCATION', 'ENTERTAINMENT', 'SPECIAL'];

export default class ActivationsPage extends React.Component {
    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
        activations : React.PropTypes.arrayOf(React.PropTypes.object),
        search      : React.PropTypes.string,
        onItemClick : React.PropTypes.func,
        onSubscribe : React.PropTypes.func,
        onShare     : React.PropTypes.func,
        onSearch    : React.PropTypes.func
    };

    componentWillUpdate() {
        console.log('componentWillUpdate');
    }

    renderQuizItem = (index, key) => {
        const { onShare, onItemClick, onItemRenderRequest, activations } = this.props;

        const activation = activations[index];

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
                id                = {activation.id}
                key               = {key}
                className         = 'ActivationsPage__quiz-card'
                name              = {activation.name}
                message           = {activation.message}
                numberOfQuestions = {activation.numberOfQuestions}
                timeToPass        = {activation.timeToPass}
                userQuizSession   = {activation.userQuizSession}
                pictureURL        = {activation.pictureURL}
                author            = {activation.author}
                category          = {activation.category}
                isSponsored       = {activation.isSponsored}
                isPassed          = {activation.isPassed}
                onShare           = {onShare.bind(this, activation)}
                onClick           = {onItemClick.bind(this, activation)}
            />
        );
    };

    renderQuizItemsGrid = (items, ref) => {
        const { l } = this.context.i18n;

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
            isEmpty,
            onItemClick,
            onSubscribe,
            onShare
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
                    type='uniform'
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
            sortBy,
            selectedCategory,
            isSharing,
            isEmbedded,
            isLoggingIn,
            isLoading,
            linkToShare,
            onSearch,
            onSpecialsSubscribe,
            onChangeSortType,
            onTabChange,
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
                        title         = {l('Quizzes')}
                        search        = {search}
                        className     = 'ActivationsPage__app-bar'
                        fixOnScroll   = {false}
                        scrollOffset  = {65}
                        displaySearch = {true}
                        onSearch      = {onSearch}
                    />

                    <div className='ActivationsPage__toolbar-container'>
                        <div className='ActivationsPage__toolbar'>
                            <Tabs
                                ripple    = {true}
                                activeTab = {selectedCategory ? CATEGORIES.indexOf(selectedCategory) : 0}
                                className = 'ActivationsPage__tabs'
                                onChange  = {(index) => onTabChange(CATEGORIES[index])}>
                                <Tab href='/activations'>
                                    {l('All tests')}
                                </Tab>
                                <Tab href='/activations?category=vacancy'>
                                    {l('Vacancies')}
                                </Tab>
                                <Tab href='/activations?category=education'>
                                    {l('Education')}
                                </Tab>
                                <Tab href='/activations?category=entertainment'>
                                    {l('Entertainment')}
                                </Tab>
                                <Tab href='/activations?category=special' className='ActivationsPage__special-tab'>
                                    <Icon type='gift' />  {l('Special offer')}
                                </Tab>
                            </Tabs>

                            <select value={sortBy} onChange={onChangeSortType} className='ActivationPage__select'>
                                <option value='popular'>
                                    {l('Show popular first')}
                                </option>

                                <option value='new'>
                                    {l('Show new first')}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='ActivationsPage__content'>
                    {
                        selectedCategory === 'SPECIAL' && !isEmbedded
                        ? <Button colored raised ripple
                            className='ActivationsPage__subscribe-btn'
                            onClick={onSpecialsSubscribe}>
                            {l('I want to receive new special offers')}
                        </Button>
                        : null

                    }

                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
