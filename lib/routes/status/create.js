'use strict';

const Joi = require('joi');

const internals = {};

module.exports = (server, options) => {

    return {
        method: 'post',
        path: '/status/{listenerId}',
        options: {
            description: 'Status for msg id',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    listenerId: Joi.string()
                })
                // // Based on what I got from 'statusCallback' on 6-26-19
                // payload: Joi.object({
                //     SmsSid: Joi.string(),
                //     SmsStatus: Joi.string().valid(internals.STATUSES), // enum: delivered, etc.
                //     MessageStatus: Joi.string().valid(internals.STATUSES), // enum: delivered, etc.
                //     To: Joi.string(),
                //     MessageSid: Joi.string(),
                //     AccountSid: Joi.string(),
                //     From: Joi.string(),
                //     ApiVersion: Joi.string()
                // })
            },
            auth: false
        },
        handler: (request) => {

            const { params: { listenerId }, payload } = request;
            request.server.events.emit('sms-status', { listenerId, payload });

            return true;
        }
    };
};

// As per docs: https://www.twilio.com/docs/sms/send-messages?code-sample=code-send-an-sms-with-a-statuscallback-url-2&code-language=Node.js&code-sdk-version=3.x
internals.STATUSES = [
    'queued',
    'failed',
    'sent',
    'delivered',
    'undelivered'
];
