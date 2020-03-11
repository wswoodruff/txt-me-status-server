'use strict';

const internals = {};

// Gabriel's number
const NUMBER_A = '9172162669';
// My number
const NUMBER_B = '2073155407';

module.exports = (server, options) => {

    return {
        method: 'post',
        path: '/txt-neighbor-number',
        options: {
            description: 'Neighbor number text back endpoint',
            tags: ['api'],
            auth: {
                strategy: 'twilio-bearer'
            }
        },
        handler: async (request) => {

            const { payload } = request;
            const { txtMeTwilioService } = request.services();

            let to;

            if (payload.From.includes(NUMBER_A)) {
                to = NUMBER_B;
            }
            else {
                to = NUMBER_A;
            }

            await txtMeTwilioService.text({
                from: payload.From,
                to,
                body: payload.Body
            });

            return true;
        }
    };
};
