import { Router } from "express";
import { dbConnection } from "@db";
import { getUsers } from "@db/queries/users";
import {
  addAnswer,
  deleteAnswer,
  editAnswer,
  getAnswersForUser,
} from "@db/queries/answers";

const router: Router = Router();

router.get("/", async (req, res) => {
  try {
    await dbConnection();

    const usersCursor = getUsers();

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    res.write("[");
    let first = true;

    usersCursor.on("data", (user) => {
      if (!first) {
        res.write(",");
      }
      first = false;
      res.write(JSON.stringify(user));
    });

    usersCursor.on("close", () => {
      res.write("]");
      res.end();
    });

    usersCursor.on("error", (err) => {
      console.error("Error occurred while streaming data:", err);
      res.status(500).send("Error occurred while streaming data");
    });
  } catch (e) {
    console.error("Error occurred while setting up stream:", e);
    res.status(500).send("Error occurred while setting up stream");
  }
});

router.get("/:id/answers", async (req, res) => {
  try {
    await dbConnection();

    const answersCursor = getAnswersForUser(req.params.id);

    res.setHeader("Content-Type", "application/json");
    res.write("[");

    let first = true;

    answersCursor.on("data", (answer) => {
      if (!first) {
        res.write(",");
      }
      first = false;
      res.write(JSON.stringify(answer));
    });

    answersCursor.on("close", () => {
      res.write("]");
      res.end();
    });

    answersCursor.on("error", (err) => {
      console.error("Error occurred while streaming data:", err);
      res.status(500).send("Error occurred while streaming data");
    });
  } catch (e) {
    console.error("Error occurred while setting up stream:", e);
    res.status(500).send("Error occurred while setting up stream");
  }
});

router.post("/:id/answers", async (req, res) => {
  try {
    await dbConnection();

    const answer = await addAnswer(req.body);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(answer));
    res.end();
  } catch (e) {
    console.error("Error occurred while adding answer:", e);
    res.status(500).send("Error occurred while adding answer");
  }
});

router.put("/:id/answers/:answerId", async (req, res) => {
  try {
    await dbConnection();

    const answer = await editAnswer(req.body, req.params.answerId);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(answer));
    res.end();
  } catch (e) {
    console.error("Error occurred while editing answer:", e);
    res.status(500).send("Error occurred while editing answer");
  }
});

router.delete("/:userId/answers/:answerId", async (req, res) => {
  try {
    await dbConnection();

    const answer = await deleteAnswer(req.params.answerId, req.params.userId);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(answer));
    res.end();
  } catch (e) {
    console.error("Error occurred while deleting answer:", e);
    res.status(500).send("Error occurred while deleting answer");
  }
});

export default router;
