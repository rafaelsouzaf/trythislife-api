import { DynamoDB } from 'aws-sdk';
import { Response } from '../util/response';

const dynamoDb = new DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const paramsGet = {
        TableName: process.env.DYNAMODB_TABLE,
        Limit: 500,
    };

    dynamoDb.scan(paramsGet, (err, data) => {
        if (err) {
            Response.error(callback, err.code, err.message);
        } else {
            // if data is Not empty, return data
            if (data.Count > 0) {
                let listUrl = '';
                data.Items.forEach((item) => {
                    listUrl += 'https://newleaf.app/@' + item.id + '\r\n';
                });
                Response.sendText(callback, 200, listUrl);
            } else {
                Response.sendText(callback, 200, '');
            }
        }
    });
};
