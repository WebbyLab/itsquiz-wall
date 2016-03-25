import React from 'react';
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

if (process.env.BROWSER) {
    require('./ActivationsPage.less');
}

const CATEGORIES = ['ALL', 'VACANCY', 'EDUCATION', 'ENTERTAINMENT', 'IFORUM'];

export default class ActivationsPage extends React.Component {
    static propTypes = {
        activations            : React.PropTypes.arrayOf(React.PropTypes.object),
        search                 : React.PropTypes.string,
        totalActivationsAmount : React.PropTypes.number,
        sortType               : React.PropTypes.string,
        selectedCategory       : React.PropTypes.string,
        linkToShare            : React.PropTypes.string,
        isLoading              : React.PropTypes.bool,
        isEmpty                : React.PropTypes.bool,
        isSharing              : React.PropTypes.bool,
        isEmbedded             : React.PropTypes.bool,
        isLoggingIn            : React.PropTypes.bool,
        onSearch               : React.PropTypes.func,
        onSpecialsSubscribe    : React.PropTypes.func,
        onChangeSortType       : React.PropTypes.func,
        onTabChange            : React.PropTypes.func,
        onLoginClose           : React.PropTypes.func,
        onStopSharing          : React.PropTypes.func,
        onItemClick            : React.PropTypes.func,
        onSubscribe            : React.PropTypes.func,
        onShare                : React.PropTypes.func,
        onItemRenderRequest    : React.PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    handleTabChange = (index) => {
        this.props.onTabChange(CATEGORIES[index]);
    };

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
                                onChange  = {this.handleTabChange}
                            >
                                <Tab> {l('All tests')} </Tab>
                                <Tab> {l('Vacancies')} </Tab>
                                <Tab> {l('Education')} </Tab>
                                <Tab> {l('Entertainment')} </Tab>
                                <Tab className='ActivationsPage__special-tab'>
                                    <Icon type='ticket' />  IFORUM
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
                        selectedCategory === 'IFORUM'
                        ?
                            <Button
                                colored
                                raised
                                ripple
                                className='ActivationsPage__subscribe-btn'
                                href='/promo/iforum-2016?skipWelcomeDialog=true'
                                target='_blank'
                            >
                                Хочу билет на iForum
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
