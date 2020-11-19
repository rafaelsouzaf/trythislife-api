import { DynamoDB } from 'aws-sdk';
import { Response } from './util/response';

const dynamoDb = new DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const { id } = event.pathParameters;
    if (!id) {
        Response.error(callback, 400, null);
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: decodeURI(id),
        },
    };

    dynamoDb.get(params, (error, data) => {
        if (error) {
            console.error(error);
            Response.error(callback, error.statusCode || 501, 'Could not fetch the todo item.');
            return;
        }
        Response.send(callback, 200, data.Item);
    });
};
