import { DynamoDB } from 'aws-sdk';
const dynamoDb = new DynamoDB.DocumentClient();

interface SimpleObj {
    id: string;
    main: number;
    profile: any;
    location: any;
}

module.exports.handler = (event, context, callback) => {
    const email = event.queryStringParameters?.email;
    if (!email) {
        error(callback, 400, null);
    }

    const paramsGet = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'email-main-index',
        KeyConditionExpression: '#email = :email',
        ExpressionAttributeNames: {
            '#email': 'email',
        },
        ExpressionAttributeValues: {
            ':email': email,
        },
    };

    dynamoDb.query(paramsGet, (err, data) => {
        if (err) {
            error(callback, err.code, err.message);
        } else {
            // if data is Not empty, return data
            if (data.Count > 0) {
                const profiles = [];
                data.Items.forEach((item) => {
                    const obj: SimpleObj = {
                        id: item.id,
                        main: item.main,
                        profile: item.profile,
                        location: item.location,
                    };
                    profiles.push(obj);
                });
                answer(callback, 200, profiles);
            } else {
                answer(callback, 200, {});
            }
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
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
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
