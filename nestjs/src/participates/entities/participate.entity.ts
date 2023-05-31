import { PollOption } from "../../polls/entities/poll-option.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Participate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.participates, {eager: true})
    user: User;

    @ManyToOne(() => PollOption, pollOption => pollOption.participates, {eager: true})
    pollOption: PollOption;
}
