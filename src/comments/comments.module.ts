import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsRepositoty } from './comments.repositoty';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsRepositoty])],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
