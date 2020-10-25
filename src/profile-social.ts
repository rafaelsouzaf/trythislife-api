import { DynamoDB } from "aws-sdk";
const dynamoDb = new DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
    if (event.body === null || event.body === undefined) {
        error(callback, 400, null);
    }
    const body = JSON.parse(event.body);
    if (!body.email) {
        error(callback, 400, null);
    }

    const paramsGet = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: "email-main-index",
        KeyConditionExpression: "#email = :email and #main = :main",
        ExpressionAttributeNames: {
            "#email": "email",
            "#main": "main",
        },
        ExpressionAttributeValues: {
            ":email": body.email,
            ":main": 1,
        },
    };

    dynamoDb.query(paramsGet, (err, data) => {
        if (err) {
            error(callback, err.code, err.message);
        } else {
            // if data is Not empty, return data
            if (data.Count > 0) {
                answer(callback, 200, data.Items[0]);
            } else {
                // if ID is not null, set email to ID
                if (body.id) {
                    updateEmail(body.id, body.email);
                } else {
                    // default answer
                    answer(callback, 200, {});
                }
            }
        }
    });

    const updateEmail = (id, email) => {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: id,
            },
            UpdateExpression: "set email = :email, main=:main",
            ConditionExpression: "main <> :num",
            ExpressionAttributeValues: {
                ":email": email,
                ":main": 1,
                ":num": 1,
            },
        };
        dynamoDb.update(params, function (err, data) {
            if (err) {
                error(callback, err.code, err.message);
            } else {
                answer(callback, 200, data);
            }
        });
    };
};

const answer = (callback, statusCode, json) => {
    delete json.email;
    delete json.main;
    callback(null, {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
            "Access-Control-Allow-Origin": "*",
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
