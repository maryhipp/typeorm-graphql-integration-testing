import * as rp from "request-promise";
import { getConnection } from "typeorm";
import { createFakeUsers } from "./factories/user";

interface Body {
    query: string;
    variables?: { [key: string]: any };
}

export const sendRequest = async (body: Body): Promise<rp.RequestPromise> => {
    const options = {
        method: "POST",
        uri: "http://localhost:4000",
        body,
        json: true
    };

    return rp(options);
};

export const createData = async ({ users }: { users?: number }) => {
    const userIds = await createFakeUsers(users);
    return { userIds };
};

export const clearDatabase = async () => {
    return await getConnection(process.env.NODE_ENV).transaction(async (manager) => {
        return Promise.all(
            manager.connection.entityMetadatas.map((entity) => manager.clear(entity.name))
        );
    });
};
