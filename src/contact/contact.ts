import { SES } from 'aws-sdk';
import { stringify } from 'querystring';
import fetch from 'node-fetch';
const ses = new SES();

module.exports.handler = (event, context, callback) => {
    const formData = JSON.parse(event.body);

    /**
     * Check Recaptcha
     */
    const secretKey = '6Lfmy90ZAAAAAJiBmE60zoUr4GyX4owYKh-t5ZSs';
    const query = stringify({
        secret: secretKey,
        response: formData.recaptcha,
        remoteip: event['requestContext']['identity']['sourceIp'],
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    fetch(verifyURL).then((res) => {
        const bodyRecaptcha = res.json();
        if (bodyRecaptcha.success !== undefined && !bodyRecaptcha.success) {
            callback(null, {
                statusCode: 403,
            });
        } else {
            /**
             * Send email
             */
            sendEmail(formData, function (err, data) {
                const response = {
                    statusCode: err ? 500 : 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        message: err ? err.message : data,
                    }),
                };

                callback(null, response);
            });
        }
    });
};

// handler.js
function sendEmail(formData, callback) {
    const emailParams = {
        Source: 'contact@newleaf.app', // SES SENDING EMAIL
        ReplyToAddresses: [formData.email],
        Destination: {
            ToAddresses: ['contact@newleaf.app'], // SES RECEIVING EMAIL
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.email}`,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'newleaf - Contact form',
            },
        },
    };

    ses.sendEmail(emailParams, callback);
}
