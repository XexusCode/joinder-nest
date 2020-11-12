import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Event } from '../events/event.entity';

@Entity()
export class UserEvent extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  rank: number;

  @Column()
  color: string;

  @ManyToMany(() => Event, { cascade: true })
  @JoinTable()
  events: Event[];
}
