import { DynamoDB } from 'aws-sdk';
import { Response } from './util/response';
import { Auth, AuthPayload } from './util/auth';

const dynamoDb = new DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
    if (event.headers['Authorization'] === undefined) {
        Response.error(callback, 400, null);
        return;
    }
    const idToken = event.headers['Authorization'];

    let leafId = null;
    if (event.body !== null && event.body !== undefined) {
        const body = JSON.parse(event.body);
        leafId = body.id || null;
    }

    console.log('header: ', idToken, leafId);
    Auth.validate(idToken)
        .then((obj: AuthPayload) => {
            console.log('result', obj);
            getLeaf(obj.email);
        })
        .catch((error) => {
            console.log('error', error);
            Response.error(callback, 401, null);
        });

    const getLeaf = (email: string) => {
        const paramsGet = {
            TableName: process.env.DYNAMODB_TABLE,
            IndexName: 'email-main-index',
            KeyConditionExpression: '#email = :email and #main = :main',
            ExpressionAttributeNames: {
                '#email': 'email',
                '#main': 'main',
            },
            ExpressionAttributeValues: {
                ':email': email,
                ':main': 1,
            },
        };

        dynamoDb.query(paramsGet, (err, data) => {
            if (err) {
                Response.error(callback, err.code, err.message);
            } else {
                // if data is Not empty, return data
                if (data.Count > 0) {
                    Response.send(callback, 200, data.Items[0]);
                } else {
                    // if ID is not null, set email to ID
                    console.log('leafId', leafId);
                    if (leafId) {
                        updateEmail(leafId, email);
                    } else {
                        // default answer
                        Response.send(callback, 200, {});
                    }
                }
            }
        });
    };

    const updateEmail = (id, email) => {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: id,
            },
            UpdateExpression: 'set email=:email, main=:main, ttLive=:ttLive',
            ConditionExpression: 'main <> :num',
            ExpressionAttributeValues: {
                ':email': email,
                ':main': 1,
                ':ttLive': 0,
                ':num': 1,
            },
        };
        dynamoDb.update(params, function (err, data) {
            if (err) {
                Response.error(callback, err.code, err.message);
            } else {
                Response.send(callback, 200, data);
            }
        });
    };
};
