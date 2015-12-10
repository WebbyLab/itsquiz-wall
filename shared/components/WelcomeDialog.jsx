import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import Dialog    from './Dialog.jsx';
import Button    from 'react-mdl/lib/Button';
import Icon      from './Icon.jsx';
import IconButton  from 'react-mdl/lib/IconButton';

if ( process.env.BROWSER ) {
    require('./WelcomeDialog.less');
}

export default class WelcomeDialog extends Component {

    static contextTypes = { i18n: PropTypes.object };

    static propTypes = {
        isOpen         : PropTypes.bool.isRequired,
        onDismiss      : PropTypes.func.isRequired,
        onRequestClose : PropTypes.func.isRequired
    };

    state = {
        currentSlide: 0
    };

    handleNextSlide = () => {
        const { currentSlide } = this.state;

        this.setState({
            currentSlide: currentSlide + 1
        });
    };

    handlePrevSlide = () => {
        const { currentSlide } = this.state;

        this.setState({
            currentSlide: currentSlide - 1
        });
    };

    render() {
        const { l } = this.context.i18n;
        const { onDismiss } = this.props;
        const { currentSlide } = this.state;

        const slides = [
            <div className='WelcomeDialog__slide'>
                <div className='WelcomeDialog__slide-image'>
                    <img src="/static/images/welcome/01.png" />
                </div>

                <div className='WelcomeDialog__slide-content'>
                    <h1> {l('Welcome to It\'s quiz!')} </h1>
                    <p> {l('Cloud platform for knowledge monitoring, creating quizzes, tests and questionnaires, '
                        + 'search and identification of talented people')} </p>
                    <Button className='WelcomeDialog__btn' raised colored>{l('Learn more')}</Button>
                </div>
            </div>,

            <div className='WelcomeDialog__slide'>
                <div className='WelcomeDialog__slide-image'>
                    <img src="/static/images/welcome/03.png" />
                </div>

                <div className='WelcomeDialog__slide-content'>
                    <h1>{l('Check your knowledge')}</h1>
                    <p> {l('Explore hundreds of open tests on Quiz Wall, check your knowledge, explore new topics, '
                        + 'share your achievements with friends')}</p>
                </div>
            </div>,

            <div className='WelcomeDialog__slide'>
                <div className='WelcomeDialog__slide-image'>
                    <img src="/static/images/welcome/02.png" />
                </div>

                <div className='WelcomeDialog__slide-content'>
                    <h1> {l('You can create a test')} </h1>
                    <p> {l('Everyone can create a test on It\'s quiz! Simply add new questions, compose a quiz'
                        + ' and share with your friends.')} </p>
                    <Button className='WelcomeDialog__btn' raised colored>{l('Create a test')}</Button>
                </div>
            </div>,

            <div className='WelcomeDialog__slide'>
                <div className='WelcomeDialog__slide-image'>
                    <img src="/static/images/welcome/04.png" />
                </div>

                <div className='WelcomeDialog__slide-content'>
                    <h1> {l('Find best ever employees')} </h1>
                    <p>{l('Filter out candidates who don’t meet your standards before you interview them. '
                        + 'Create test for a position, publish on Quiz Wall, enjoy interviewing only the best.')}</p>
                    <Button className='WelcomeDialog__btn' raised colored>{l('Create a vacancy')}</Button>
                </div>
            </div>
        ];

        return (
            <div className='WelcomeDialog'>
                <Dialog
                    className = 'WelcomeDialog__dialog'
                    onRequestClose={onDismiss}
                    {...this.props}>
                    <div className='WelcomeDialog__content'>
                        <div className='WelcomeDialog__carousel'>
                            <IconButton ripple
                                name     = 'keyboard_arrow_left'
                                disabled = {currentSlide === 0}
                                onClick  = {this.handlePrevSlide}
                            />

                            <div className='WelcomeDialog__slide-wrapper'>
                                {slides[currentSlide]}
                            </div>

                            <IconButton ripple
                                name     = 'keyboard_arrow_right'
                                disabled = {currentSlide === slides.length - 1}
                                onClick  = {this.handleNextSlide}
                            />
                        </div>

                        <span className='WelcomeDialog__skip' onClick={onDismiss}>
                            {l('Skip this message')}
                        </span>
                    </div>
                </Dialog>
            </div>
        );
    }
}
