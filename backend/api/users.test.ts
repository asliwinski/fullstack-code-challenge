import { inferProcedureInput } from "@trpc/server";
import { dbConnection } from "@db";
import { appRouter, AppRouter, createCallerFactory } from "./trpc";
import { UserModel } from "@models/users";

const createCaller = createCallerFactory(appRouter);

const caller = createCaller({});

beforeAll(async () => {
  await dbConnection();
}, 9999999);

describe("users - empty", () => {
  beforeEach(async () => {
    await UserModel.deleteMany();
  });

  test("getUsers - empty", async () => {
    const res = await caller.getUsers();
    expect(res).toEqual([]);
  });

  test("addUser", async () => {
    const input: inferProcedureInput<AppRouter["addUser"]> = {
      name: "John Smith",
      email: "john@smith.com",
    };

    const res = await caller.addUser(input);
    const resJson = res.toJSON();
    expect(resJson._id).toBeDefined();
    expect(resJson.name).toEqual("John Smith");
    expect(resJson.email).toEqual("john@smith.com");
  });
});

describe("users - existing", () => {
  beforeEach(async () => {
    await UserModel.deleteMany();
    const input: inferProcedureInput<AppRouter["addUser"]> = {
      name: "John Smith",
      email: "john@smith.com",
    };

    await caller.addUser(input);
  });

  test("getUsers - one", async () => {
    const res = await caller.getUsers();
    const leanRes = res.map((user) => ({ name: user.name, email: user.email }));
    expect(leanRes).toEqual([{ name: "John Smith", email: "john@smith.com" }]);
  });
});

afterAll(async () => {
  await mongoose.conn.connection.close();
  await mongoServer.stop();
});
