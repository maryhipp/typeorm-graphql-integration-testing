import * as faker from "faker";
import { getConnection } from "typeorm";

import { UserRepository } from "../../../repository";
import { User } from "../../../entity/User";

export const buildFakeUser = (user?: Partial<User>) => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.random.number(),
        ...user
    };
};

export const createFakeUsers = (count?: number) => {
    return getConnection(process.env.NODE_ENV).transaction(async (manager) => {
        const userRepository = await manager.getCustomRepository(UserRepository);
        let idList: Array<string> = [];

        for (let index = 0; index < (count || 10); index++) {
            const userData = buildFakeUser();
            const newUser = await userRepository.createUser(userData);
            const savedUser = await userRepository.save(newUser);
            if (savedUser && savedUser.id) idList.push(savedUser.id);
        }

        return Promise.resolve(idList);
    });
};
