import { appRouter, AppRouter, createCallerFactory } from "./trpc";
import { dbConnection } from "@db";
import { inferProcedureInput } from "@trpc/server";
import { Question, QuestionModel } from "@models/questions";

const createCaller = createCallerFactory(appRouter);

const caller = createCaller({});

beforeAll(async () => {
  await dbConnection();
}, 9999999);

describe("questions - empty", () => {
  beforeEach(async () => {
    await QuestionModel.deleteMany();
  });

  test("getQuestions - empty", async () => {
    const res = await caller.getQuestions();
    expect(res).toEqual([]);
  });

  test("addQuestion", async () => {
    const input: inferProcedureInput<AppRouter["upsertQuestion"]> = {
      content: "What is the meaning of life?",
    };

    const res = await caller.upsertQuestion(input);
    const resJson = res?.toJSON();
    expect(resJson?._id).toBeDefined();
    expect(resJson?.content).toEqual("What is the meaning of life?");
  });
});

describe("questions - existing", () => {
  let firstQuestionTransformed: Question & { _id: string };

  beforeEach(async () => {
    await QuestionModel.deleteMany();
    const input: inferProcedureInput<AppRouter["upsertQuestion"]> = {
      content: "What is the meaning of life?",
    };

    await caller.upsertQuestion(input);

    const res = await caller.getQuestions();
    const firstQuestion = res[0];
    firstQuestionTransformed = {
      ...firstQuestion,
      _id: firstQuestion._id.toString(),
    } as Question & { _id: string };
  });

  test("getQuestions - one", async () => {
    const res = await caller.getQuestions();
    const leanRes = res.map((question) => ({ content: question.content }));
    expect(leanRes).toEqual([{ content: "What is the meaning of life?" }]);
  });

  test("editQuestion", async () => {
    const res2 = await caller.upsertQuestion({
      content: "What is the answer to life, the universe and everything?",
      question: firstQuestionTransformed!,
    });
    const res2Json = res2?.toJSON();
    expect(res2Json?._id.toString()).toEqual(firstQuestionTransformed._id);
    expect(res2Json?.content).toEqual(
      "What is the answer to life, the universe and everything?"
    );
  });

  test("deleteQuestion", async () => {
    const res2 = await caller.deleteQuestion(firstQuestionTransformed._id);
    expect(res2).toBeDefined();
    const res3 = await caller.getQuestions();
    expect(res3.length).toEqual(0);
  });
});

afterAll(async () => {
  await mongoose.conn.connection.close();
  await mongoServer.stop();
});
