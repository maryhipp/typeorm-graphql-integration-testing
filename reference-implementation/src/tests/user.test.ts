import { getConnection } from "typeorm";

import { UserInput } from "../graphql/types";
import { sendRequest, clearDatabase, createData } from "./test-utils/helpers";
import { getServer } from "..";
import { buildFakeUser } from "./test-utils/factories/user";
import { userMatcher } from "./test-utils/matchers";
const { mutations, queries } = require("./test-utils/generated-output");

let userIdList: Array<string> = [];

describe("user endpoint tests", () => {
    beforeAll(async () => {
        return getServer();
    });
    afterAll(async () => {
        await getConnection(process.env.NODE_ENV).close();
        const app = await getServer();
        if (app) await app.close();
        return Promise.resolve();
    });

    beforeEach(async (done) => {
        await clearDatabase();
        const { userIds } = await createData({ users: 20 });
        userIdList = userIds;
        done();
    });

    it("creates a user", async (done) => {
        const userInput: UserInput = buildFakeUser();
        const response = await sendRequest({
            query: mutations.createUser,
            variables: { userInput }
        });
        expect(response.data.createUser).toEqual(expect.objectContaining(userInput));

        return done();
    });

    it("updates a user", async (done) => {
        const userInput: UserInput = buildFakeUser();
        const response = await sendRequest({
            query: mutations.updateUser,
            variables: { userInput, id: userIdList[0] }
        });
        expect(response.data.updateUser).toEqual(expect.objectContaining(userInput));

        return done();
    });

    it("deletes a user", async (done) => {
        const response = await sendRequest({
            query: mutations.deleteUser,
            variables: { id: userIdList[0] }
        });
        expect(response.data.deleteUser).toEqual(JSON.stringify(userIdList[0]));

        return done();
    });

    it("gets a user", async (done) => {
        const response = await sendRequest({
            query: queries.user,
            variables: { id: userIdList[0] }
        });
        expect(response.data.user).toMatchObject(userMatcher);

        return done();
    });

    it("gets users", async (done) => {
        const response = await sendRequest({ query: queries.users });
        expect(response.data.users).toHaveLength(20);
        expect(response.data.users[0]).toMatchObject(userMatcher);

        return done();
    });
    it("creates a user", async (done) => {
        const userInput: UserInput = buildFakeUser();
        const response = await sendRequest({
            query: mutations.createUser,
            variables: { userInput }
        });
        expect(response.data.createUser).toEqual(expect.objectContaining(userInput));

        return done();
    });

    it("updates a user", async (done) => {
        const userInput: UserInput = buildFakeUser();
        const response = await sendRequest({
            query: mutations.updateUser,
            variables: { userInput, id: userIdList[0] }
        });
        expect(response.data.updateUser).toEqual(expect.objectContaining(userInput));

        return done();
    });

    it("deletes a user", async (done) => {
        const response = await sendRequest({
            query: mutations.deleteUser,
            variables: { id: userIdList[0] }
        });
        expect(response.data.deleteUser).toEqual(JSON.stringify(userIdList[0]));

        return done();
    });

    it("gets a user", async (done) => {
        const response = await sendRequest({
            query: queries.user,
            variables: { id: userIdList[0] }
        });
        expect(response.data.user).toMatchObject(userMatcher);

        return done();
    });

    it("gets users", async (done) => {
        const response = await sendRequest({ query: queries.users });
        expect(response.data.users).toHaveLength(20);
        expect(response.data.users[0]).toMatchObject(userMatcher);

        return done();
    });
});
