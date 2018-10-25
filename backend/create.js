import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    let labels;
    if (event.body.hasOwnProperty('labels')) {
        labels = event.body.labels;
    } else {
        labels = {};
    }

    const params = {
        TableName: "aws-bookmarks-bookmarks",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            bookmarkId: uuid.v1(),
            url: event.body.url,
            name: event.body.name,
            labels: labels,
            deleted: false,
            createdAt: Date.now()
        }
    };
    console.log(params);

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log(e);
        callback(null, failure({ status: false }));
    }
}