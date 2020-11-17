import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEventRepository } from './repository/userEvent.repository';
import { UserEventService } from './userEvents.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEventRepository])],
  providers: [UserEventService],
  exports: [UserEventService],
})
export class UserEventsModule {}
