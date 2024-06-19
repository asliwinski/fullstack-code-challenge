import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
// @ts-ignore
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "@api/trpc";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
