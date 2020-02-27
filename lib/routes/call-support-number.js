'use strict';

const { twiml: { VoiceResponse } } = require('twilio');

const internals = {};

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
            response.dial(options.supportAgentNumber);
            response.say('Goodbye');

            return response.toString();
        }
    };
};
