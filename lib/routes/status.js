'use strict';

const Joi = require('joi');

const internals = {};

module.exports = (server, options) => {

    return {
        method: 'post',
        path: '/status',
        options: {
            description: 'Status for msg id',
            tags: ['api'],
            auth: false
        },
        handler: (request) => {

            console.log('request.payload', request.payload);
            return 'hi';
        }
    };
};
