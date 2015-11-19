import React from 'react';
import cx    from 'classnames';

import { Tab, Tabs }  from 'react-mdl/lib/tabs';
import Grid, { Cell } from 'react-mdl/lib/Grid';

import QuizCard from '../QuizCard.jsx';
import AppBar   from '../AppBar.jsx';

if ( process.env.BROWSER ) {
    require('./ActivationsPage.less');
}

const CATEGORIES = ['ALL', 'VACANCY', 'EDUCATION', 'ENTERTAINMENT'];

export default class ActivationsPage extends React.Component {
    static contextTypes = { i18n: React.PropTypes.object };

    static propTypes = {
        activations: React.PropTypes.arrayOf(React.PropTypes.object),
        search:      React.PropTypes.string,
        onItemClick: React.PropTypes.func,
        onSearch:    React.PropTypes.func
    };

    render() {
        const { activations, search, selectedCategory, isEmbedded, onItemClick, onSearch, onTabChange } = this.props;
        const { l } = this.context.i18n;

        const classes = cx('ActivationsPage', {
            'ActivationsPage--embedded' : isEmbedded
        });

        return (
            <div className={classes}>
                {
                    !isEmbedded
                    ? <AppBar
                        title         = {l('Quizzes')}
                        search        = {search}
                        scrollOffset  = {65}
                        displaySearch = {true}
                        onSearch      = {onSearch}
                    />
                    : null
                }

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

