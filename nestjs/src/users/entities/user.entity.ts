import { Exclude } from "class-transformer";
import { Poll } from "../../polls/entities/poll.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Poll, poll => poll.user)
    polls: Poll[];
}
