import "reflect-metadata";
import { getConnectionOptions, createConnection, getConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
import * as fs from "fs";
import { Server as HttpsServer } from "https";
import { Server as HttpServer } from "http";

import { UserInput } from "./graphql/types";
import { UserRepository } from "./repository";

const typeDefs = fs.readFileSync(path.join(__dirname, "./graphql/schema.graphql"), "utf8");

let userRepository: UserRepository;

export const initConnection = async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return createConnection(connectionOptions);
};

const resolvers = {
    Query: {
        user: (_: {}, args: { id: string }) => userRepository.findOneById(args.id),
        users: () => userRepository.findAll()
    },
    Mutation: {
        createUser: (_: {}, args: { userInput: UserInput }) =>
            userRepository.createUser(args.userInput),
        deleteUser: (_: {}, args: { id: string }) => userRepository.deleteOneById(args.id),
        updateUser: (_: {}, args: { id: string; userInput: UserInput }) =>
            userRepository.updateUser(args.id, args.userInput)
    }
};

let server: HttpServer | HttpsServer;
let serverPromise: Promise<HttpServer | HttpsServer | undefined>;

export const getServer = async () => {
    if (server) return Promise.resolve(server);
    if (serverPromise) {
        return serverPromise;
    }
    try {
        serverPromise = startServer();
        return serverPromise;
    } catch (e) {
        console.log(e);
    }
};

const startServer = async () => {
    console.log("Starting server");
    const gqlServer = new GraphQLServer({ typeDefs, resolvers, context: {} });
    await initConnection();
    console.log("TypeORM connected");
    await getConnection(process.env.NODE_ENV).runMigrations();
    userRepository = new UserRepository();
    console.log("Server is running on localhost:4000");
    try {
        server = await gqlServer.start();
        return server;
    } catch (e) {
        console.log(e);
    }
};

if (process.env.NODE_ENV !== "test") startServer();
