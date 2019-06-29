'use strict';

const internals = {};

module.exports = (server, options) => {

    return {
        method: 'get',
        path: '/test-sse',
        options: {
            description: 'Test SSE',
            tags: ['api'],
            auth: false
        },
        handler: (request) => {

            request.server.events.emit('sms-status', { testing: 'This is a test' });

            return true;
        }
    };
};
