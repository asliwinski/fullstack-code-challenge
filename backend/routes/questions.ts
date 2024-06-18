import { Router } from "express";
import { dbConnection } from "@db";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "@db/queries/questions";

const router: Router = Router();

router.get("/", async (req, res) => {
  try {
    await dbConnection();

    const usersCursor = getQuestions();

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

router.post("/", async (req, res) => {
  try {
    await dbConnection();

    const question = await addQuestion(req.body);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(question));
    res.end();
  } catch (e) {
    console.error("Error occurred while adding question:", e);
    res.status(500).send("Error occurred while adding question");
  }
});

router.put("/:id", async (req, res) => {
  try {
    await dbConnection();

    const question = await editQuestion(req.body, req.params.id);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(question));
    res.end();
  } catch (e) {
    console.error("Error occurred while editing question:", e);
    res.status(500).send("Error occurred while editing question");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await dbConnection();

    const question = await deleteQuestion(req.params.id);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(question));
    res.end();
  } catch (e) {
    console.error("Error occurred while deleting question:", e);
    res.status(500).send("Error occurred while deleting question");
  }
});

export default router;
