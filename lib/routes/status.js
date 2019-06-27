'use strict';

const internals = {};

module.exports = (server, options) => {

    return {
        method: 'post',
        path: '/status',
        options: {
            description: 'Status for msg id',
            tags: ['api'],
            // validate: {
            //     // Based on what I got from 'statusCallback' on 6-26-19
            //     payload: Joi.object({
            //         SmsSid: Joi.string(),
            //         SmsStatus: Joi.string().valid(internals.STATUSES), // enum: delivered, etc.
            //         MessageStatus: Joi.string().valid(internals.STATUSES), // enum: delivered, etc.
            //         To: Joi.string(),
            //         MessageSid: Joi.string(),
            //         AccountSid: Joi.string(),
            //         From: Joi.string(),
            //         ApiVersion: Joi.string()
            //     })
            // },
            auth: false
        },
        handler: (request) => {

            this.server.events.emit('sms-status', request.payload);

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
