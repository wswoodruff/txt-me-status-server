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

            const { smsStatusService } = request.server.services();

            const stream = new PassThrough({ objectMode: true });

            const handlerBoundStream = internals.statusHandler.bind(this, stream);

            smsStatusService.addListener(request.info.id, handlerBoundStream);

            // let inactivityTimeout;
            // const resetTimeout = () => {
            //
            //     inactivityTimeout = internals.resetTimeout(inactivityTimeout, () => internals.end(server, stream, handlerBoundStream));
            // };
            //
            // resetTimeout();

            setInterval(() => {

                stream.push(Math.random());
            }, 5000);

            // Found out about the 'X-Accel-Buffering' header from here!
            // https://serverfault.com/questions/801628/for-server-sent-events-sse-what-nginx-proxy-configuration-is-appropriate
            return h.event(stream, null, { event: 'status' })
                .header('X-Accel-Buffering', 'no');
        }
    };
};

internals.resetTimeout = (timeout, func) => {

    clearTimeout(timeout);
    return setTimeout(func, INACTIVITY_TIMEOUT);
};

internals.statusHandler = (stream, ...args) => {

    console.log('Sending a msg', ...args);
    stream.push(...args);
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
