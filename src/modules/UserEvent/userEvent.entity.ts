import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../events/entity/event.entity';
import { User } from '../auth/entity/user.entity';
import { Comment } from '../comments/entity/comments.entity';

@Entity()
export class UserEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (event) => event.id)
  user: User;

  @Column()
  username: string;

  @Column()
  rank: number;

  @Column()
  color: string;

  @OneToMany(() => Comment, (comment) => comment.userEvent, {
    eager: true,
  })
  comments: Comment[];
  @ManyToOne(() => Event, (event) => event.userEvents, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
