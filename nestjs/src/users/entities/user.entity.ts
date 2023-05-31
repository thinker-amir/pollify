import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participate } from '../../participates/entities/participate.entity';
import { Poll } from '../../polls/entities/poll.entity';

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

  @OneToMany(() => Poll, (poll) => poll.user)
  polls: Poll[];

  @OneToMany(() => Participate, (participate) => participate.user)
  participates: Participate[];
}
