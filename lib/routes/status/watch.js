'use strict';

const { PassThrough } = require('stream');
const Joi = require('joi');
const { STATUSES } = require('../../constants');

// We close the stream on a timeout because I've experienced
// a time when the 'delivered' status made it before the
// 'sent' status!! =O
// See the related comment where this const is used
const FINAL_EVENT_TIMEOUT = 250;

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

        const handler = (evt) => {

            stream.push(evt);

            // End stream on final-ish events
            if (evt.MessageStatus === STATUSES.DELIVERED ||
                evt.MessageStatus === STATUSES.FAILED ||
                evt.MessageStatus === STATUSES.UNDELIVERED) {

                setTimeout(() => {

                    // I'd love to find a way to avoid this timeout,
                    // because it affects every successful response
                    // as well.

                    // I think it's just a consequence of possible latency.
                    // If the events are sent from Twilio in the correct
                    // order, there's no guarantee they'll arrive in the correct order.
                    stream.push(null);
                    smsStatusService.removeListener(request.info.id);
                }, FINAL_EVENT_TIMEOUT);
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
