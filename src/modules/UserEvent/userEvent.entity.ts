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
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Entity()
export class UserEvent extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ManyToOne(() => User, (event) => event.id)
  user: User;

  @ApiProperty()
  @Column()
  @Expose()
  username: string;

  @ApiProperty()
  @Column()
  @Expose()
  rank: number;

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty({ type: () => Comment })
  @OneToMany(() => Comment, (comment) => comment.userEvent, {
    eager: true,
  })
  comments: Comment[];

  @ApiProperty({ type: () => Event })
  @ManyToOne(() => Event, (event) => event.userEvents, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
