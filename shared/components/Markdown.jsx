 /* eslint
    react/no-danger: 0
*/

import React, { Component, PropTypes } from 'react';

const MarkdownIt = require('markdown-it');

class Markdown extends Component {

    static propTypes = {
        source : PropTypes.string.isRequired
    };

    static defaultProps = {
        source : 'Nothing to view'
    };

    componentWillMount() {
        this.md = new MarkdownIt('zero').set({ linkify: true }).enable(['link', 'list', 'emphasis']);
    }

    getMarkdownMarkup = () => {
        const renderedMarkdown = this.md.render(this.props.source);

        return {
            __html : renderedMarkdown
        };
    };

    render() {
        return (
            <div
                dangerouslySetInnerHTML={this.getMarkdownMarkup()}
            />
        );
    }
}

export default Markdown;
