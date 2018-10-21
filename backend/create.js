import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "aws-bookmarks-bookmarks",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            bookmarkId: uuid.v1(),
            url: data.url,
            name: data.name,
            description: data.description,
            createdAt: Date.now()
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log(e);
        callback(null, failure({ status: false }));
    }
}