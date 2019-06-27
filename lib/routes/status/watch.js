'use strict';

const { PassThrough } = require('stream');
const Joi = require('joi');

const internals = {};

const INACTIVITY_TIMEOUT = 60000; // 1 min

module.exports = (server, options) => {

    return {
        method: 'get',
        path: '/status/{listenerId}',
        options: {
            description: 'Watch status for listenerId',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    listenerId: Joi.string().required()
                })
            },
            auth: false
        },
        handler: (request, h) => {

            const stream = new PassThrough({ objectMode: true });

            // This is awful but I don't have time right now to make it better
            // (handler is defined below)
            let handler;

            const end = (finalEvent) => {

                server.events.removeListener('sms-status', handler);

                if (finalEvent) {
                    stream.push(finalEvent);
                }

                // End stream
                stream.push(null);
            };

            let inactivityTimeout;
            const resetTimeout = () => {

                inactivityTimeout = internals.resetTimeout(inactivityTimeout, end);
            };

            handler = (...args) => {

                resetTimeout();
                stream.push(...args);
            };

            resetTimeout();

            this.server.events.addListener('sms-status', handler);

            return h.event(stream);
        }
    };
};

internals.resetTimeout = (timeout, func) => {

    clearTimeout(timeout);
    return setTimeout(func, INACTIVITY_TIMEOUT);
};
