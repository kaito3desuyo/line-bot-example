'use strict';
const AWS = require('aws-sdk');

module.exports = class DynamoDBSessionStore {
    constructor(params) {
        let configParam = {};

        if (params.accessToken && params.secretToken) {
            configParam = {
                ...configParam,
                credentials: new AWS.Credentials({
                    accessKeyId: params.accessToken,
                    secretAccessKey: params.secretToken,
                }),
            };
        }

        if (params.region) {
            configParam = {
                ...configParam,
                region: params.region,
            };
        } else {
            throw new TypeError("Required parameter 'region' does not exist.");
        }

        if (params.tableName) {
            this._tableName = params.tableName;
        } else {
            throw new TypeError(
                "Required parameter 'tableName' does not exist."
            );
        }

        AWS.config.update(configParam);
        this._ddb = new AWS.DynamoDB.DocumentClient();
    }

    async init() {
        return this;
    }

    async read(key) {
        const result = await this._ddb
            .get({
                TableName: this._tableName,
                Key: {
                    key,
                },
            })
            .promise();
        return result?.Item?.session ?? null;
    }

    async all() {
        const result = await this._ddb
            .scan({
                TableName: this._tableName,
            })
            .promise();
        return result?.Items.map((o) => o.session);
    }

    async write(key, session) {
        await this._ddb
            .put({
                TableName: this._tableName,
                Item: {
                    key,
                    session,
                },
            })
            .promise();
    }

    async destroy(key) {
        await this._ddb
            .delete({
                TableName: this._tableName,
                Key: {
                    key,
                },
            })
            .promise();
    }
};
