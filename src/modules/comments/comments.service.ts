import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from './repository/commentsRepository';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entity/comments.entity';
import { EventService } from '../events/events.service';
import { commentMapping } from './commentMapping/commentMapping';
import { UserEventService } from '../UserEvent/userEvents.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentRepository: CommentsRepository,

    private eventService: EventService,
    private userEventService: UserEventService,
  ) {}

  async addComment(
    commentDto: CommentDto,
    id,
    username: string,
  ): Promise<Comment> {
    await this.eventService.validateEvent(id, username);
    const event = await this.eventService.getEventByIdWithUser(id, username);
    const userEvent = await this.userEventService.getUser(
      id,
      username,
      username,
    );
    const comment = await commentMapping.toEntity(commentDto, event, userEvent);
    return this.commentRepository.addComment(comment);
  }

  async deleteComment(
    id: number,
    username: string,
    idComment: number,
  ): Promise<void> {
    await this.eventService.validateEvent(id, username);
    const result = await this.commentRepository.delete({ id: idComment });

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateComment(
    id: number,
    username: string,
    idComment: number,
    commentDto: CommentDto,
  ): Promise<CommentDto> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventByIdWithUser(id, username);
    const userEvent = await this.userEventService.getUser(
      id,
      username,
      username,
    );
    const newcomment = await commentMapping.toEntity(
      commentDto,
      event,
      userEvent,
    );
    await this.commentRepository.update({ id: idComment }, newcomment);
    return newcomment;
  }

  async getComment(
    id: number,
    username: string,
    idComment: number,
  ): Promise<Comment> {
    await this.eventService.validateEvent(id, username);
    return this.commentRepository.getComment(idComment);
  }

  async getAllComments(id: number, username: string): Promise<Comment[]> {
    const event = await this.eventService.getEventByIdWithUser(id, username);
    return event.comments;
  }
}
