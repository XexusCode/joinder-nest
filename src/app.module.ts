import { Module } from '@nestjs/common';
import { EventsModule } from './modules/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CommentsModule } from './modules/comments/comments.module';
import { TodosModule } from './modules/todos/todos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    EventsModule,
    AuthModule,
    CommentsModule,
    TodosModule,
  ],
})
export class AppModule {}
