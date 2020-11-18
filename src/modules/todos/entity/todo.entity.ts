import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../events/entity/event.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Todo extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty({ type: () => Event })
  @ManyToOne(() => Event, (event) => event.todos, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
