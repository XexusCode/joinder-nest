import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from '../comments/comments.entity';
import { UserEvent } from '../userEvent/userEvent.entity';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  nmax: number;

  @Column()
  startDate: number;

  @Column()
  endDate: number;

  @Column()
  location: string;

  @Column()
  img: string;

  @ManyToMany(() => UserEvent, { cascade: true })
  @JoinTable()
  users: UserEvent[];

  @OneToMany(() => Comment, (comment) => comment.event, {
    eager: true,
    cascade: true,
  })
  comments: Comment[];
}
