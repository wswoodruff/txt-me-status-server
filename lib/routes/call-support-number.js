'use strict';

const { twiml: { VoiceResponse } } = require('twilio');

const internals = {};

const SUPPORT_AGENT_NUMBER = '2073155407';

module.exports = (server, options) => {

    return {
        method: 'post',
        path: '/call-support-number',
        options: {
            description: 'Support number call back endpoint',
            tags: ['api'],
            auth: {
                strategy: 'twilio-bearer'
            }
        },
        handler: (request) => {

            const response = new VoiceResponse();
            response.dial(SUPPORT_AGENT_NUMBER);
            response.say('Goodbye');

            return response.toString();
        }
    };
};
