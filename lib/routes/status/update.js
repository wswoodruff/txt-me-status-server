'use strict';

const Joi = require('joi');

const internals = {};

module.exports =  {
    method: 'post',
    path: '/status/{listenerId?}',
    options: {
        description: 'Update sms status',
        tags: ['api'],
        validate: {
            params: Joi.object({
                listenerId: Joi.string()
            })
            // Why would I validate (and possibly reject) a message from Twilio?
            // This is just here to for documentation
            // payload: internals.payloadSchema
        },
        auth: false
    },
    handler: (request) => {

        const { params: { listenerId }, payload } = request;
        request.server.events.emit('sms-status', { listenerId, ...payload });

        return true;
    }
};

// Based on what I got from 'statusCallback' on 6-26-19
// internals.payloadSchema = Joi.object({
//     SmsSid: Joi.string(),
//     SmsStatus: Joi.string().valid(internals.STATUSES), // enum: delivered, etc.
//     MessageStatus: Joi.string().valid(internals.STATUSES), // enum: delivered, etc.
//     To: Joi.string(),
//     MessageSid: Joi.string(),
//     AccountSid: Joi.string(),
//     From: Joi.string(),
//     ApiVersion: Joi.string()
// });
