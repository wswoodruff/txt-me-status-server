'use strict';

const internals = {};

module.exports = (server, options) => {

    return {
        method: 'post',
        path: '/text-back',
        options: {
            description: 'Text back endpoint',
            tags: ['api'],
            auth: false
        },
        handler: async (request) => {

            const { payload } = request;
            const { txtMeTwilioService } = request.models();

            const phoneNumber = await txtMeTwilioService.getDefaultOrRandomNumber();

            await txtMeTwilioService.text({
                from: phoneNumber,
                to: options.textBackNumber,
                body: JSON.stringify(payload, null, 4)
            });

            return true;
        }
    };
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
