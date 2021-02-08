import express from "express";

const app: express.Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router: express.Router = express.Router();
router.get("/api/getTest", (req: express.Request, res: express.Response) => {
  res.send(req.query);
});
router.post("/api/postTest", (req: express.Request, res: express.Response) => {
  res.send(req.body);
});
app.use(router);

app.listen(3000, () =>
  console.log("Line bot Example app listening on port 3000!")
);
