'use strict';

const { PassThrough } = require('stream');
const Joi = require('joi');

const internals = {};

module.exports = {
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

        // Simple handler
        const handler = (evt) => {

            stream.push(evt);

            if (evt.payload.MessageStatus === 'delivered') {
                stream.push(null);
            }
        };

        // This listener will be removed in the smsStatusService
        // when the request sends its response or aborts
        smsStatusService.addListener(request.info.id, handler);

        // Init the stream
        // NOTE: The client must agree to expect a first event that says 'open'
        stream.push('open');

        // 'X-Accel-Buffering' is a necessary header to set if you're using nginx!

        // Found out about the 'X-Accel-Buffering' header from here:
        // https://serverfault.com/questions/801628/for-server-sent-events-sse-what-nginx-proxy-configuration-is-appropriate
        return h.event(stream, null, { event: 'status' })
            .header('X-Accel-Buffering', 'no');
    }
};
