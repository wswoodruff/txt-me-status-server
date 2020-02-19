'use strict';

const internals = {};

module.exports = (srv, options) => ({
    name: 'twilio-bearer',
    scheme: 'bearer-access-token',
    options: {
        allowQueryToken: true,
        accessTokenName: 'bearer',
        validate: (request, token, h) => ({
            isValid: token === options.twilio.bearer,
            credentials: {}
        })
    }
});
