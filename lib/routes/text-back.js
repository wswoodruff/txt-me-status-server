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
            const { txtMeTwilioService } = request.services();

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
