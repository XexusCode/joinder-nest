import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

import { Comment } from '../comments/comments.entity';

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

  //   @Column()
  //   users: [Array]<UsersEventObject>;
  //
  //   @Column()
  //   todos: Array<string>;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Comment, (comment) => comment.event, { eager: true })
  comments: Comment[];
}
