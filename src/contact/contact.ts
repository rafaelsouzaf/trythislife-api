import { SES } from 'aws-sdk';
const ses = new SES();

module.exports.handler = (event, context, callback) => {
    const formData = JSON.parse(event.body);

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
