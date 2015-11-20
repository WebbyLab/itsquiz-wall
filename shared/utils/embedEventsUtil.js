export default class EmbedEventsUtil {
    constructor({ embedOrigin }) {
        this.events = {};
        this.embedOrigin = embedOrigin;
    }

    send(data) {
        window.parent.postMessage(data, this.embedOrigin);
    }

    handleEvents = ({ isTrusted, data }) => {
        if (isTrusted) {
            const {type, ...otherParams} = data;
            const args = Object.keys(otherParams).map(key => otherParams[key]);
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
