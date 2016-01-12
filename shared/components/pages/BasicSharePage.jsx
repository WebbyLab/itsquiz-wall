import React from 'react';

export default class BasicSharePage extends React.Component {
    static propTypes = {
        title   : React.PropTypes.string,
        picture : React.PropTypes.string,
        text    : React.PropTypes.string
    };

    render() {
        const {
            title,
            picture,
            text
        } = this.props;

        return (
            <div className='BasicSharePage' style={{ height: 0 }}>
                <h1 itemprop="name">{title}</h1>
                <img src={picture} itemprop="image"/>
                <p itemprop="description">{text}</p>
            </div>
        );
    }
}
