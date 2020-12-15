export class Response {
    static send = (callback, statusCode, json) => {
        delete json.email;
        delete json.main;
        callback(null, {
            statusCode: statusCode,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(json),
        });
    };

    static sendText = (callback, statusCode, text) => {
        callback(null, {
            statusCode: statusCode,
            headers: {
                'Content-Type': 'text/plain',
            },
            body: text,
        });
    };

    static error = (callback, statusCode, msg) => {
        if (msg) {
            console.error(msg);
        }
        callback(null, {
            statusCode: statusCode,
        });
    };
}
