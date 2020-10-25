import { DynamoDB } from "aws-sdk";
const dynamoDb = new DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const { id } = event.pathParameters;
    if (!id) {
        callback(null, {
            statusCode: 400,
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: id,
        },
    };

    // fetch todo from the database
    dynamoDb.get(params, (error, data) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                body: "Could not fetch the todo item.",
            });
            return;
        }

        delete data.Item.email;
        delete data.Item.main;

        // create a response
        const response = {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Origin": `*`,
            },
            body: JSON.stringify(data.Item),
        };
        callback(null, response);
    });
};
