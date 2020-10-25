import { DynamoDB } from 'aws-sdk';
const dynamoDb = new DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
    if (event.body === null || event.body === undefined) {
        error(callback, 400, null);
    }
    const body = JSON.parse(event.body);
    if (!body.email || !body.id) {
        error(callback, 400, null);
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: body.id,
        },
        UpdateExpression: 'set email = :email, main=:main',
        ConditionExpression: 'main = :num AND attribute_not_exists(email)',
        ExpressionAttributeValues: {
            ':email': body.email,
            ':main': 5,
            ':num': 0,
        },
    };
    dynamoDb.update(params, function (err, data) {
        if (err) {
            error(callback, err.code, err.message);
        } else {
            answer(callback, 200, {});
        }
    });
};

const answer = (callback, statusCode, json) => {
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

const error = (callback, statusCode, msg) => {
    if (msg) {
        console.error(msg);
    }
    callback(null, {
        statusCode: statusCode,
    });
};
