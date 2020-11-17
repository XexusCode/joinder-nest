import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../events/entity/event.entity';
import { UserEvent } from '../../UserEvent/userEvent.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  date: string;

  @ManyToOne(() => Event, (event) => event.comments, { onDelete: 'CASCADE' })
  event: Event;

  @ManyToOne(() => UserEvent, (userEvent) => userEvent.comments, {
    onDelete: 'CASCADE',
  })
  userEvent: UserEvent;

  @Column()
  userEventUsername: string;
}
