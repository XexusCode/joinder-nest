import { Module } from '@nestjs/common';
import { UserEventRepository } from './userEvent.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsRepositoty } from '../comments/comments.repositoty';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEventRepository]),
    TypeOrmModule.forFeature([CommentsRepositoty]),
  ],
  controllers: [],
  providers: [UserEventRepository],
})
export class UserEventsModule {}
