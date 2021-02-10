import * as line from "@line/bot-sdk";
import AWS from "aws-sdk";
import * as dialogflow from "dialogflow";
import * as dotenv from "dotenv";
import express from "express";
import {
  ddbConfig,
  dialogflowConfig,
  lineClientConfig,
  lineMiddlewareConfig,
} from "./config";

dotenv.config();

const app: express.Express = express();

app.use("/webhook", line.middleware(lineMiddlewareConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router: express.Router = express.Router();
router.get("/", (req, res) => res.send("Hello LINE Bot Example!"));
router.post("/webhook", (req, res) => {
  console.log(req.body.events);
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});
app.use(router);

const client = new line.Client(lineClientConfig);
const documentClient = new AWS.DynamoDB.DocumentClient(ddbConfig);
const dialogflowClient = new dialogflow.SessionsClient(dialogflowConfig);

const handleEvent = async (event: line.WebhookEvent) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const currentUserStatus = await documentClient
    .query({
      TableName: "line-bot-example",
      KeyConditionExpression: "lineUserId = :userId",
      ExpressionAttributeValues: {
        ":userId": event.source.userId,
      },
    })
    .promise();

  const responses = await dialogflowClient.detectIntent({
    session: dialogflowClient.sessionPath(
      process.env.GOOGLE_PROJECT_ID ?? "",
      event.source.userId ?? ""
    ),
    queryInput: {
      text: {
        text: event.message.text,
        languageCode: "ja",
      },
    },
  });

  if (
    currentUserStatus.Count === 0 ||
    responses[0].queryResult?.action !== "input.unknown"
  ) {
    if (responses[0].queryResult?.action === "handle-delivery-order") {
      return handleDeliveryOrderEvent(
        event,
        responses[0].queryResult?.parameters
      );
    }
  } else {
    if (
      currentUserStatus.Items &&
      currentUserStatus.Items[0].actionType === "handle-delivery-order"
    ) {
      return handleDeliveryOrderEvent(
        event,
        currentUserStatus.Items[0].parameters,
        currentUserStatus.Items[0].nextFill
      );
    }
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "毎度！出前するときは「出前」とリプライしてくれい！",
  });
};

const handleDeliveryOrderEvent = async (
  event: line.WebhookEvent,
  parameters: any,
  nextFill: string = ""
) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const result = await documentClient
    .put({
      TableName: "line-bot-example",
      Item: {
        lineUserId: event.source.userId,
        actionType: "handle-delivery-order",
        parameters: nextFill
          ? {
              fields: {
                ...parameters.fields,
                [nextFill]: {
                  kind: "stringValue",
                  stringValue: event.message.text,
                },
              },
            }
          : parameters,
        nextFill: "",
      },
    })
    .promise();

  console.log(result);

  const current = await documentClient
    .get({
      TableName: "line-bot-example",
      Key: {
        lineUserId: event.source.userId,
        actionType: "handle-delivery-order",
      },
    })
    .promise();

  const menu =
    current.Item &&
    current.Item.parameters.fields.menu &&
    current.Item.parameters.fields.menu[
      current.Item.parameters.fields.menu.kind
    ];
  const location =
    current.Item &&
    current.Item.parameters.fields.location &&
    current.Item.parameters.fields.location[
      current.Item.parameters.fields.location.kind
    ];

  if (!menu) {
    await documentClient
      .put({
        TableName: "line-bot-example",
        Item: {
          lineUserId: event.source.userId,
          actionType: "handle-delivery-order",
          parameters: current.Item?.parameters,
          nextFill: "menu",
        },
      })
      .promise();

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `毎度！出前ね。ご注文は？`,
    });
  } else if (!location) {
    await documentClient
      .put({
        TableName: "line-bot-example",
        Item: {
          lineUserId: event.source.userId,
          actionType: "handle-delivery-order",
          parameters: {
            fields: {
              ...current.Item?.parameters.fields,
              location: {
                kind: "stringValue",
                stringValue: "",
              },
            },
          },
          nextFill: "location",
        },
      })
      .promise();

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `毎度！${menu}ね。どちらにお届けしましょ？`,
    });
  } else {
    await documentClient
      .delete({
        TableName: "line-bot-example",
        Key: {
          lineUserId: event.source.userId,
          actionType: "handle-delivery-order",
        },
      })
      .promise();

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `毎度！${menu}を${JSON.stringify(
        location
      )}にお届け！ありがとうございますー！`,
    });
  }
};

app.listen(3000, () =>
  console.log("Line bot Example app listening on port 3000!")
);

export default app;
