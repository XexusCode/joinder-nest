import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventService } from './events.service';
import { EventRepository } from './repository/event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from '../comments/comments.service';
import { CommentsRepository } from '../comments/repository/commentsRepository';
import { UserRepository } from '../auth/repository/user.repository';
import { UserEventRepository } from '../UserEvent/repository/userEvent.repository';
import { UserEventService } from '../UserEvent/userEvents.service';
import { TodosService } from '../todos/todos.service';
import { TodoRepository } from '../todos/repository/todo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository]),
    TypeOrmModule.forFeature([CommentsRepository]),
    TypeOrmModule.forFeature([UserEventRepository]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [EventsController],
  providers: [
    EventService,
    CommentsService,
    UserRepository,
    UserEventService,
    UserEventRepository,
    TodosService,
    TodoRepository,
  ],
  exports: [EventService],
})
export class EventsModule {}
