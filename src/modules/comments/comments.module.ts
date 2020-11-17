import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsRepository } from './repository/commentsRepository';
import { EventService } from '../events/events.service';
import { UserEventService } from '../UserEvent/userEvents.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsRepository])],
  providers: [CommentsService, EventService, UserEventService],
  exports: [CommentsService],
})
export class CommentsModule {}
