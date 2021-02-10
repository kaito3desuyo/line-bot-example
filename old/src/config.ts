import * as line from "@line/bot-sdk";
import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import * as dialogflow from "dialogflow";
import * as dotenv from "dotenv";
dotenv.config();

export const lineMiddlewareConfig: line.MiddlewareConfig = {
  channelSecret: process.env.CHANNEL_SECRET ?? "",
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
} as const;

export const lineClientConfig: line.ClientConfig = {
  channelSecret: process.env.CHANNEL_SECRET ?? "",
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
} as const;

export const dialogflowConfig: dialogflow.ClientOptions = {
  projectId: process.env.GOOGLE_PROJECT_ID ?? "",
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL ?? "",
    private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  },
};

export const ddbConfig: AWS.DynamoDB.DocumentClient.DocumentClientOptions &
  ServiceConfigurationOptions &
  AWS.DynamoDB.ClientApiVersions = {
  apiVersion: "2012-08-10",
  region: "ap-northeast-1",
};
