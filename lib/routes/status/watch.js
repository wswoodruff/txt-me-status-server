'use strict';

const { PassThrough } = require('stream');
const Joi = require('joi');

const internals = {};

const INACTIVITY_TIMEOUT = 60000; // 1 min

module.exports = (server, options) => {

    return {
        method: 'get',
        path: '/status/{listenerId?}',
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

            // const stream = new PassThrough({ objectMode: true });

            let msgCount = 1;

            const func = (msg) => {

                console.log('Sending msg');
                h.event({ id: msgCount++, data: msg });
            };

            const handlerBoundStream = internals.statusHandler.bind(this, func);

            // let inactivityTimeout;
            // const resetTimeout = () => {
            //
            //     inactivityTimeout = internals.resetTimeout(inactivityTimeout, () => internals.end(server, stream, handlerBoundStream));
            // };
            //
            // resetTimeout();

            request.server.events.addListener('sms-status', handlerBoundStream);

            // Remove listener eventually and push null

            return h.event({ event: 'open' });
        }
    };
};

internals.resetTimeout = (timeout, func) => {

    clearTimeout(timeout);
    return setTimeout(func, INACTIVITY_TIMEOUT);
};

internals.statusHandler = (func, ...args) => {

    func(...args);
};

internals.end = ({ server, stream, handler, finalEvent }) => {

    server.events.removeListener('sms-status', handler);

    if (finalEvent) {
        stream.push(finalEvent);
    }

    // End stream
    stream.push(null);
};

internals.resetInactivityTimeout = ({ timeout, server, stream, endFunc, endFuncArgs }) => {

    clearTimeout(timeout);
    return setTimeout(() => endFunc({ server, stream, ...endFuncArgs }), INACTIVITY_TIMEOUT);
};
