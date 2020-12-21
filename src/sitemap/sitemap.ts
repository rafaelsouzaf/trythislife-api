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
        Limit: 1000,
    };

    dynamoDb.query(paramsGet, (err, data) => {
        if (err) {
            Response.error(callback, err.code, err.message);
        } else {
            // if data is Not empty, return data
            if (data.Count > 0) {
                let listUrl = '';
                data.Items.forEach((item) => {
                    listUrl += makeLinksByLang('@' + item.id);
                });
                listUrl += makeLinksByLang('');
                listUrl += makeLinksByLang('faq');
                listUrl += makeLinksByLang('donation');
                listUrl += makeLinksByLang('contact');
                listUrl += makeLinksByLang('privacy-policy');
                listUrl += makeLinksByLang('terms-of-service');
                listUrl += makeLinksByLang('@rafael-souza-fijalkowski');
                Response.sendText(callback, 200, listUrl);
            } else {
                Response.sendText(callback, 200, '');
            }
        }
    });
};

const langs = [
    'en',
    // 'ar',
    // 'bn',
    // 'zh-CN',
    // 'de',
    // 'es',
    // 'fi',
    // 'fr',
    // 'hi',
    // 'is',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'no',
    // 'fa',
    // 'pl',
    // 'pt',
    // 'ru',
    // 'so',
    // 'sv',
    // 'tr',
];

const makeLinksByLang = (path: string): string => {
    let links = 'https://www.newleaf.app/' + encodeURI(path) + '\r\n';
    langs.forEach((lang) => {
        if (lang === 'en') {
            return;
        }
        links += 'https://www.newleaf.app/' + encodeURI(path) + '?lang=' + lang + '\r\n';
    });
    return links;
};
