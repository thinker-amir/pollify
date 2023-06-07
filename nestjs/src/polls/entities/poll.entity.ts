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

  @OneToMany(() => PollOption, (pollOption) => pollOption.poll, {
    cascade: true,
    eager: true,
  })
  options: PollOption[];

  @ManyToOne(() => User, (user) => user.polls)
  user: User;
}
