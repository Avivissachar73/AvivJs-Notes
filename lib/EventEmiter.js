export class EventEmiter {
    Events = {};

    constructor(isDuplicatedEvents = true) {
        this.isDuplicatedEvents = isDuplicatedEvents;
    }

    on = (eventName, cb) => {
        if (!this.isDuplicatedEvents) {
            this.Events[eventName] = cb;
            return () => {};
        }
        if (!this.Events[eventName]) this.Events[eventName] = [];
        this.Events[eventName].push(cb);
        return () => this.off(eventName, cb);
    }

    off = (eventName, cb) => {
        if (!this.isDuplicatedEvents || !cb) {
            delete this.Events[eventName];
            return;
        }
        var idx = this.Events[eventName].findIndex(curr => curr === cb);
        // if (idx === -1) throw new Error(`Something went wrong removing event "${eventName}"`);
        if (idx === -1) return;
        this.Events[eventName].splice(idx, 1);
    }

    emit = (eventName, ...args) => {
        if (!this.Events[eventName]) return;
        if (typeof (this.Events[eventName]) === 'function') return this.Events[eventName](...args);
        else this.Events[eventName].forEach(curr => curr(...args));
    }
}