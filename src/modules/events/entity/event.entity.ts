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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Event extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  nmax: number;

  @ApiProperty()
  @Column()
  startDate: string;

  @ApiProperty()
  @Column()
  endDate: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  img: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  users: User[];
  @OneToMany(() => Comment, (comment) => comment.event, {
    eager: true,
  })
  @ApiProperty({ type: () => Comment })
  comments: Comment[];

  @OneToMany(() => UserEvent, (userEvent) => userEvent.event, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => UserEvent })
  userEvents: UserEvent[];

  @OneToMany(() => Todo, (todo) => todo.event, {
    eager: true,
  })
  @ApiProperty({ type: () => Todo })
  todos: Todo[];
}
