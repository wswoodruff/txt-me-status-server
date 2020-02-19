'use strict';

const internals = {};

const SUPPORT_NUMBER = '+19173828293';
const SUPPORT_AGENT_NUMBER = '9172162669';

module.exports = (server, options) => {

    return {
        method: 'post',
        path: '/txt-support-number',
        options: {
            description: 'Support number text back endpoint',
            tags: ['api'],
            auth: {
                strategy: 'twilio-bearer'
            }
        },
        handler: async (request) => {

            const { payload } = request;
            const { txtMeTwilioService } = request.services();

            let to = SUPPORT_AGENT_NUMBER;
            let msg;

            const supportTextBackRegEx = new RegExp(/txt\s\d+\s/i);
            const supportTextBackToNumberRegEx = new RegExp(/txt\s(\d+)\s/i);

            if (payload.From.includes(SUPPORT_AGENT_NUMBER)) {
                if (payload.Body.match(supportTextBackRegEx)) {
                    // The 1th index holds the parens target match
                    to = payload.Body.match(supportTextBackToNumberRegEx)[1];
                    msg = payload.Body.replace(supportTextBackRegEx, '');
                }
                else {
                    msg = 'To text a number back send in this pattern: "Txt 55512345" (Casing doesn\'t matter)';
                }
            }
            else {
                msg = `(From ${payload.From}) ${payload.Body}`;
            }

            await txtMeTwilioService.text({
                from: SUPPORT_NUMBER,
                to,
                body: msg
            });

            return true;
        }
    };
};
