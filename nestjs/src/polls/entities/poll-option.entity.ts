import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Participate } from "../../participates/entities/participate.entity";
import { Poll } from "./poll.entity";

@Entity()
export class PollOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @ManyToOne(() => Poll, poll => poll.options,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: "delete"
    })
  poll: Poll;

  @OneToMany(() => Participate, participate => participate.pollOption)
  participates: Participate[];
}
