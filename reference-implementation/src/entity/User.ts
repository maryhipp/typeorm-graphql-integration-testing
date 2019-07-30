import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id?: string;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column()
    public age: number;

    constructor(firstName: string, lastName: string, age: number) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }
}
