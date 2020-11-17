import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comments/entity/comments.entity';
import { User } from '../../auth/entity/user.entity';
import { UserEvent } from '../../UserEvent/userEvent.entity';
import { Todo } from '../../todos/entity/todo.entity';

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

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  users: User[];
  @OneToMany(() => Comment, (comment) => comment.event, {
    eager: true,
  })
  comments: Comment[];

  @OneToMany(() => UserEvent, (userEvent) => userEvent.event, {
    onDelete: 'CASCADE',
  })
  userEvents: UserEvent[];

  @OneToMany(() => Todo, (todo) => todo.event, {
    eager: true,
  })
  todos: Todo[];
}
