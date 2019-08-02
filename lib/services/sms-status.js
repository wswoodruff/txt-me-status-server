'use strict';

const Schmervice = require('schmervice');

const internals = {};

module.exports = class SmsStatusService extends Schmervice.Service {

    constructor(server, options) {

        super(server, options);

        this.server.event('sms-status');

        this.handler = this._handler.bind(this);
        this.cleanup = this._cleanup.bind(this);

        this.server.events.addListener('sms-status', this.handler);
        this.listeners = {}; // Keyed by request.info.id

        this.server.events.on({ name: 'request', channels: 'internal' }, this.cleanup);
        this.server.events.on({ name: 'request', channels: 'error' }, this.cleanup);
    }

    teardown() {

        this.server.events.removeListener('sms-status', this.handler);
    }

    addListener(reqId, handler) {

        this.listeners[reqId] = handler;
    }

    removeListener(reqId) {

        delete this.listeners[reqId];
    }

    _handler(evt) {

        Object.values(this.listeners).forEach(async (handler) => {

            await handler(evt);
        });
    }

    _cleanup(request, { tags }) {

        if (tags.includes('abort') ||
            tags.includes('closed') ||
            tags.includes('timeout') ||
            tags.includes('error')) {

            this.removeListener(request.info.id);
        }
    }
};
