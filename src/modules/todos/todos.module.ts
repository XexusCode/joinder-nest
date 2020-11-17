import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventService } from '../events/events.service';
import { UserEventService } from '../UserEvent/userEvents.service';
import { TodoRepository } from './repository/todo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TodoRepository])],
  providers: [TodosService, EventService, UserEventService],
  exports: [TodosService],
})
export class TodosModule {}
