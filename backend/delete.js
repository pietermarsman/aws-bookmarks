import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const item = {
        userId: event.requestContext.identity.cognitoIdentityId,
        bookmarkId: event.pathParameters.id,
        deleted: true
    };

    const params = {
        TableName: "aws-bookmarks-bookmarks",
        Item: item
    };

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log(e);
        callback(null, failure({ status: false }));
    }
}