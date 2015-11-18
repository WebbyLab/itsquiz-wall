import React from 'react';

import { Layout, Header, Navigation, HeaderRow, HeaderTabs, Drawer, Content } from 'react-mdl/lib/layout';
import { Tab } from 'react-mdl/lib/Tabs';
import Grid, { Cell } from 'react-mdl/lib/Grid';

import QuizCard from '../QuizCard.jsx';
import AppBar   from '../AppBar.jsx';

if ( process.env.BROWSER ) {
    require('./ActivationsPage.less');
}

export default class ActivationsPage extends React.Component {
    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
        activations: React.PropTypes.arrayOf(React.PropTypes.object),
        search:      React.PropTypes.string,
        onItemClick: React.PropTypes.func,
        onSearch:    React.PropTypes.func
    };

    render() {
        const { activations, search, onItemClick, onSearch, onTabChange } = this.props;
        const { l } = this.context.i18n;

        return (
            <div className='ActivationsPage'>
                <AppBar
                    title         = {l('Quizzes')}
                    search        = {search}
                    scrollOffset  = {0}
                    displaySearch = {true}
                    onSearch      = {onSearch}
                />

                <Header className='ActivationsPage__tab-bar'>
                    <HeaderTabs activeTab={1} onChange={onTabChange} ripple={true}>
                        <Tab>{l('Vacancies')}</Tab>
                        <Tab>{l('Educational')}</Tab>
                        <Tab>{l('Entertainment')}</Tab>
                    </HeaderTabs>
                </Header>

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
                                onClick           = {onItemClick.bind(this, activation)}
                            />
                        </Cell>
                    )}
                </Grid>
            </div>
        );
    }
}

