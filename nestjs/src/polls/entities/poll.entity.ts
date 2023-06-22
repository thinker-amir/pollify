import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PollOption } from './poll-option.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  publishDate: Date;

  @Column({ type: 'timestamp' })
  expireDate: Date;

  @Column({ nullable: true })
  cover: string;

  @OneToMany(() => PollOption, (pollOption) => pollOption.poll, {
    cascade: true,
  })
  options: PollOption[];

  @ManyToOne(() => User, (user) => user.polls)
  user: User;
}
