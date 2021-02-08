import express from "express";
import * as line from "@line/bot-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  channelSecret: process.env.CHANNEL_SECRET ?? "",
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
} as const;

const app: express.Express = express();

app.use("/webhook", line.middleware(config));
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

const client = new line.Client(config);
const handleEvent = async (event: line.WebhookEvent) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text,
  });
};

app.listen(3000, () =>
  console.log("Line bot Example app listening on port 3000!")
);

export default app;
