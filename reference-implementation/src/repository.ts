import { Repository, getConnection, EntityRepository } from "typeorm";

import { User } from "./entity/User";
import { UserInput } from "./graphql/types";

export abstract class BaseEntityRepository<T> {
    constructor(public repository: Repository<T>) {}

    public async findOneById(id: string): Promise<T | undefined> {
        return this.repository.findOne(id);
    }

    public async findManyByIds(ids: string[]): Promise<T[] | undefined> {
        return this.repository.findByIds(ids);
    }

    public async findAll(): Promise<T[] | undefined> {
        return this.repository.find();
    }

    public async deleteOneById(id: string): Promise<string> {
        await this.repository.delete(id);
        return id;
    }

    public async save(entity: T): Promise<T | undefined> {
        return this.repository.save(entity);
    }

    public async saveAll(entity: T[]): Promise<T[] | undefined> {
        return this.repository.save(entity);
    }
}

@EntityRepository(User)
export class UserRepository extends BaseEntityRepository<User> {
    constructor() {
        super(getConnection(process.env.NODE_ENV).getRepository(User));
    }

    public async createUser({ firstName, lastName, age }: UserInput) {
        const user = new User(firstName, lastName, age);
        return this.repository.save(user);
    }

    public async updateUser(id: string, { firstName, lastName, age }: UserInput) {
        const user = await super.findOneById(id);
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.age = age;
            return this.repository.save(user);
        }
    }
}
