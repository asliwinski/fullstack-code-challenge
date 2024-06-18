import express from "express";
import "dotenv/config";
import cors from "cors";
import users from "./routes/users";
import questions from "@routes/questions";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.use("/users", users);
app.use("/questions", questions);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
