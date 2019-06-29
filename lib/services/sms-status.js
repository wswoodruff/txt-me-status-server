'use strict';

const Schmervice = require('schmervice');

const internals = {};

module.exports = class SmsStatusService extends Schmervice.Service {

    constructor(server, options) {

        super(server, options);

        this.server.event('sms-status');
    }

    
};
