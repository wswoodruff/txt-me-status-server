'use strict';

const internals = {};

const NEIGHBOR_ALIAS_NUMBER = '+19173828293';

const NUMBER_A = '9172162669';
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

            console.log('payload', payload);

            return true;

            let to;

            if (payload.From.includes(NUMBER_A)) {
                to = NUMBER_B;
            }
            else {
                to = NUMBER_A;
            }

            await txtMeTwilioService.text({
                from: NEIGHBOR_ALIAS_NUMBER,
                to,
                body: payload.Body,
                // mediaUrl:
            });

            return true;
        }
    };
};
