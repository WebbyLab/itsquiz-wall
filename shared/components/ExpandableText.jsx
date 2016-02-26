import React, { Component, PropTypes } from 'react';

import Button from 'react-mdl/lib/Button';

if (process.env.BROWSER) {
    require('./ExpandableText.less');
}

const MAX_CHAR_NUMBER = 300;

export default class ExpandableText extends Component {

    static propTypes = {
        text: PropTypes.string
    };

    static contextTypes = { i18n: React.PropTypes.object };

    state = {
        expanded: false
    };

    handleClick = () => {
        if (!this.state.expanded) {
            this.setState({
                expanded: true
            });
        } else {
            this.setState({
                expanded: false
            });
        }
    };

    render() {
        const { l } = this.context.i18n;
        const { text } = this.props;

        return (
            <div className='ExpandableText'>
            {
                text.length > MAX_CHAR_NUMBER
                ?
                    <div>
                        {
                            !this.state.expanded
                            ?
                                <p className='ExpandableText__text minimized' ref={c => this.textBlock = c}>
                                    {text}
                                </p>
                            :
                                <p className='ExpandableText__text' ref={c => this.textBlock = c}>
                                    {text}
                                </p>
                        }
                        <Button
                            colored
                            ripple
                            className = 'ExpandableText__expand-button'
                            onClick   = {this.handleClick}
                        >
                            {
                                this.state.expanded
                                ?
                                    l('Minimize')
                                :
                                    l('Expand')
                                }
                        </Button>
                    </div>
                :
                    <p className='ExpandableText_text'>
                        {text}
                    </p>
            }
            </div>
        );
    }
}
