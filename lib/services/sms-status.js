'use strict';

const Schmervice = require('schmervice');

const internals = {};

module.exports = class SmsStatusService extends Schmervice.Service {

    constructor(server, options) {

        super(server, options);

        this.server.event('sms-status');

        this.server.events.addListener('sms-status', this.handler.bind(this));
        this.listeners = {}; // Keyed by request.info.id

        this.server.events.on({ name: 'request', channels: 'internal' }, this.cleanup.bind(this));
        this.server.events.on({ name: 'request', channels: 'error' }, this.cleanup.bind(this));
    }

    teardown() {

        this.server.events.removeListener('sms-status', this.handler);
    }

    addListener(reqId, handler) {

        this.listeners[reqId] = handler;
    }

    removeListener(reqId) {

        console.log('Listeners');
        console.log(this.listeners);

        console.log('Removing', reqId);
        delete this.listeners[reqId];

        console.log('After');
        console.log(this.listeners);
    }

    handler(evt) {

        Object.values(this.listeners).forEach(async (handler) => {

            await handler(evt);
        });
    }

    cleanup(request, { tags }) {

        if (tags.includes('abort')) {
            this.removeListener(request.info.id);
        }
    }
};
