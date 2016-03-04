 /* eslint
    react/no-danger: 0
*/

import React, { Component, PropTypes } from 'react';

import { activationDescriptionPreset } from './Markdown/presets.js';

import MarkdownIt from 'markdown-it';

class Markdown extends Component {

    static propTypes = {
        source : PropTypes.string.isRequired
    };

    static defaultProps = {
        source : 'Nothing to view'
    };

    componentWillMount() {
        this.md = new MarkdownIt();
        this.md.configure(activationDescriptionPreset).enable('linkify').enable(['link', 'list', 'emphasis']);
    }

    getMarkdownMarkup = () => {
        const renderedMarkdown = this.md.render(this.props.source);

        return {
            __html : renderedMarkdown
        };
    };

    render() {
        return <div dangerouslySetInnerHTML={this.getMarkdownMarkup()} />;
    }
}

export default Markdown;
