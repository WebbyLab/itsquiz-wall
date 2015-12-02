import React from 'react';
import cx    from 'classnames';

import { Tab, Tabs }  from 'react-mdl/lib/Tabs';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import Spinner        from 'react-mdl/lib/Spinner';

import QuizCard    from '../QuizCard.jsx';
import AppBar      from '../AppBar.jsx';
import ShareDialog from '../../containers/ShareDialog.jsx';

if ( process.env.BROWSER ) {
    require('./ActivationsPage.less');
}

const CATEGORIES = ['ALL', 'VACANCY', 'EDUCATION', 'ENTERTAINMENT'];

export default class ActivationsPage extends React.Component {
    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
        activations : React.PropTypes.arrayOf(React.PropTypes.object),
        search      : React.PropTypes.string,
        onItemClick : React.PropTypes.func,
        onShare     : React.PropTypes.func,
        onSearch    : React.PropTypes.func
    };

    renderContent = () => {
        const { l } = this.context.i18n;
        const { activations, search, isLoading, isEmpty, onItemClick, onShare } = this.props;

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
            <Grid className='ActivationsPage__list'>
                {activations.map( activation =>
                    <Cell
                        key    = {activation.id}
                        align  = 'stretch'
                        col    = {3}
                        tablet = {6}
                        phone  = {12}>
                        <QuizCard
                            name              = {activation.name}
                            message           = {activation.message}
                            numberOfQuestions = {activation.numberOfQuestions}
                            timeToPass        = {activation.timeToPass}
                            pictureURL        = {activation.pictureURL}
                            author            = {activation.author}
                            onShare           = {onShare.bind(this, activation)}
                            onClick           = {onItemClick.bind(this, activation)}
                        />
                    </Cell>
                )}
            </Grid>
        );
    };

    render() {
        const {
            search,
            selectedCategory,
            isSharing,
            isEmbedded,
            isLoading,
            linkToShare,
            onSearch,
            onTabChange,
            onLogin,
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
                    isOpen         = {isSharing}
                    linkToShare    = {linkToShare}
                    onRequestClose = {onStopSharing}
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
                        onLogin       = {onLogin}
                    />

                    <div className='ActivationsPage__tab-bar'>
                        <Tabs
                            ripple    = {true}
                            activeTab = {selectedCategory ? CATEGORIES.indexOf(selectedCategory) : 0}
                            className = 'ActivationsPage__tabs'
                            onChange  = {(index) => onTabChange(CATEGORIES[index])}>

                            <Tab>{l('All tests')}</Tab>
                            <Tab>{l('Vacancies')}</Tab>
                            <Tab>{l('Education')}</Tab>
                            <Tab>{l('Entertainment')}</Tab>
                        </Tabs>
                    </div>
                </div>

                <div className='ActivationsPage__content'>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
