import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventService } from './events.service';
import { EventRepository } from './event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from '../comments/comments.service';
import { CommentsRepositoty } from '../comments/comments.repositoty';
import { UserRepository } from '../auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository]),
    TypeOrmModule.forFeature([CommentsRepositoty]),
  ],
  controllers: [EventsController],
  providers: [EventService, CommentsService, UserRepository],
})
export class EventsModule {}
