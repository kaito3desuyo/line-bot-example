import express from "express";
import line from "@line/bot-sdk";

const config = {
  channelSecret: "6a552d3a8497d973dc48c066313b6187",
  channelAccessToken:
    "NzFiiDGf6Lt+uiBAjvUZ6hQ+pQvBBJG3DUE0iUgsT+/77HagDc490kFlsutZeZQynZWkxPxbnqg3qLI2IA32dEup7EpW/WNzmO9AJ/e6F3N/wUiTlx3lan83LRXAZbDX7UMzLDpRF4LKH4rRp35CrAdB04t89/1O/w1cDnyilFU=",
} as const;

const app: express.Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router: express.Router = express.Router();
router.get("/", (req, res) => res.send("Hello LINE Bot Example!"));
router.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});
app.use(router);

const client = new line.Client(config);
const handleEvent = async (event) => {
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
