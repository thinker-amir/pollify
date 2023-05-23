import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
}
