import { embedOrigin } from '../config';

export default class embedEventsUtil {
    constructor(isParent) {
        this.events = {};
    }

    send(data) {
        window.parent.postMessage(data, embedOrigin);
    }

    handleEvents = ({ isTrusted, data }) => {
        if (isTrusted) {
            const {type, ...params} = data;
            const args = Object.keys(params).map(key => params[key]);
            return this.events[type] ? this.events[type](...args) : null;
        }
    };

    subscribe(events) {
        this.events = events;
        window.addEventListener('message', this.handleEvents, false);
    }

    unsubscribe() {
        window.removeEventListener('message', this.handleEvents);
    }
}
