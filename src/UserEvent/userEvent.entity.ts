import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../auth/user.entity';

@Entity()
export class UserEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (event) => event.id, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  username: string;

  @Column()
  rank: number;

  @Column()
  color: string;

  @ManyToOne(() => Event, (event) => event.userEvents)
  event: Event;
}
