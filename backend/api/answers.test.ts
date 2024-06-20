import { appRouter, AppRouter, createCallerFactory } from "./trpc";
import { dbConnection } from "@db";
import { inferProcedureInput } from "@trpc/server";
import { Answer, AnswerModel } from "@models/answers";

const createCaller = createCallerFactory(appRouter);

const caller = createCaller({});

let userId: string;
let questionId: string;

beforeAll(async () => {
  await dbConnection();
  const input: inferProcedureInput<AppRouter["addUser"]> = {
    name: "John Smith",
    email: "john@smith.com",
  };

  const res = await caller.addUser(input);
  userId = res?.toJSON()?._id.toString();

  const inputQuestion: inferProcedureInput<AppRouter["upsertQuestion"]> = {
    content: "What is the meaning of life?",
  };

  const resQuestion = await caller.upsertQuestion(inputQuestion);
  questionId = resQuestion?.toJSON()?._id.toString()!;
}, 9999999);

describe("answers - empty", () => {
  beforeEach(async () => {
    await AnswerModel.deleteMany();
  });

  test("getAnswersForUser - empty", async () => {
    const res = await caller.getAnswersForUser(userId);
    expect(res).toEqual([]);
  });

  test("addAnswer", async () => {
    const input: inferProcedureInput<AppRouter["upsertAnswer"]> = {
      content:
        "The meaning of life is a deeply philosophical and personal question. There is no single, universally accepted answer.",
      questionId,
      userId,
    };

    const res = await caller.upsertAnswer(input);
    const resJson = res?.toJSON();
    expect(resJson?._id).toBeDefined();
    expect(resJson?.user.toString()).toEqual(userId);
    expect(resJson?.question.toString()).toEqual(questionId);
    expect(resJson?.content).toEqual(
      "The meaning of life is a deeply philosophical and personal question. There is no single, universally accepted answer."
    );
  });
});

describe("answers - existing", () => {
  let firstAnswerTransformed: Answer & { _id: string };

  beforeEach(async () => {
    await AnswerModel.deleteMany();
    const input: inferProcedureInput<AppRouter["upsertAnswer"]> = {
      content:
        "The meaning of life is a deeply philosophical and personal question. There is no single, universally accepted answer.",
      questionId,
      userId,
    };

    await caller.upsertAnswer(input);

    const res = await caller.getAnswersForUser(userId);
    const firstAnswer = res[0];
    firstAnswerTransformed = {
      ...firstAnswer,
      _id: firstAnswer._id.toString(),
    } as Answer & { _id: string };
  });

  test("getAnswersForUser - one", async () => {
    const res = await caller.getAnswersForUser(userId);
    const leanRes = res.map((answer) => ({ content: answer.content }));
    expect(leanRes).toEqual([
      {
        content:
          "The meaning of life is a deeply philosophical and personal question. There is no single, universally accepted answer.",
      },
    ]);
  });

  test("editAnswer", async () => {
    const res2 = await caller.upsertAnswer({
      content:
        "Ultimately, the meaning of life is something that each individual must determine for themselves.",
      questionId,
      userId,
      answer: firstAnswerTransformed!,
    });
    const res2Json = res2?.toJSON();
    expect(res2Json?._id.toString()).toEqual(firstAnswerTransformed._id);
    expect(res2Json?.user.toString()).toEqual(userId);
    expect(res2Json?.question.toString()).toEqual(questionId);
    expect(res2Json?.content).toEqual(
      "Ultimately, the meaning of life is something that each individual must determine for themselves."
    );
  });

  test("deleteAnswer", async () => {
    const res2 = await caller.deleteAnswer({
      answerId: firstAnswerTransformed._id,
      userId,
    });
    expect(res2).toBeDefined();
    const res3 = await caller.getAnswersForUser(userId);
    expect(res3.length).toEqual(0);
  });
});

afterAll(async () => {
  await mongoose.conn.connection.close();
  await mongoServer.stop();
});
