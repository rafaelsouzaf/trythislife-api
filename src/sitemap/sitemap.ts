import { DynamoDB } from 'aws-sdk';
import { Response } from '../util/response';

const dynamoDb = new DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const paramsGet = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'latest-items-index',
        KeyConditionExpression: 'main = :main',
        ExpressionAttributeValues: {
            ':main': 0,
        },
        ScanIndexForward: false,
        Limit: 500,
    };

    dynamoDb.query(paramsGet, (err, data) => {
        if (err) {
            Response.error(callback, err.code, err.message);
        } else {
            // if data is Not empty, return data
            if (data.Count > 0) {
                let listUrl = '';
                data.Items.forEach((item) => {
                    listUrl += 'https://newleaf.app/@' + item.id + '\r\n';
                });
                listUrl += 'https://newleaf.app\r\n';
                listUrl += 'https://newleaf.app/faq\r\n';
                listUrl += 'https://newleaf.app/donation\r\n';
                listUrl += 'https://newleaf.app/contact\r\n';
                listUrl += 'https://newleaf.app/privacy-policy\r\n';
                listUrl += 'https://newleaf.app/terms-of-service\r\n';
                listUrl += 'https://newleaf.app/@rafael-souza-fijalkowski\r\n';
                Response.sendText(callback, 200, listUrl);
            } else {
                Response.sendText(callback, 200, '');
            }
        }
    });
};
