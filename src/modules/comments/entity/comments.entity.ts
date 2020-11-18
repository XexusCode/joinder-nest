import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../events/entity/event.entity';
import { UserEvent } from '../../UserEvent/userEvent.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty()
  @Column()
  date: string;

  @ApiProperty({ type: () => Event })
  @ManyToOne(() => Event, (event) => event.comments, { onDelete: 'CASCADE' })
  event: Event;

  @ApiProperty({ type: () => UserEvent })
  @ManyToOne(() => UserEvent, (userEvent) => userEvent.comments, {
    onDelete: 'CASCADE',
  })
  userEvent: UserEvent;

  @ApiProperty()
  @Column()
  userEventUsername: string;
}
