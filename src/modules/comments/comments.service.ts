import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from './repository/commentsRepository';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './entity/comments.entity';
import { EventService } from '../events/events.service';
import { commentMapping } from './commentMapping/commentMapping';
import { UserEventService } from '../UserEvent/userEvents.service';
import { typesMessages } from '../auth/types/types.messages';

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
  ): Promise<{ result: Comment; message: string }> {
    await this.eventService.validateEvent(id, username);
    const event = await this.eventService.getEventById(id);
    const { result: userEvent } = await this.userEventService.getUser(
      id,
      username,
      username,
    );
    const comment = await commentMapping.toEntity(commentDto, event, userEvent);
    const newcomment = await this.commentRepository.addComment(comment);
    delete newcomment.userEvent;
    delete newcomment.event;
    return {
      message: `${typesMessages.COMMENT}  ${typesMessages.CREATED}`,
      result: newcomment,
    };
  }

  async deleteComment(
    id: number,
    username: string,
    idComment: number,
  ): Promise<{ message: string }> {
    await this.eventService.validateEvent(id, username);
    const result = await this.commentRepository.delete({ id: idComment });

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return {
      message: `${typesMessages.COMMENT} ${idComment} ${typesMessages.DELETED}`,
    };
  }

  async updateComment(
    id: number,
    username: string,
    idComment: number,
    commentDto: CommentDto,
  ): Promise<{ message: string }> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventById(id);
    const { result: userEvent } = await this.userEventService.getUser(
      id,
      username,
      username,
    );
    const newcomment = await commentMapping.toEntity(
      commentDto,
      event,
      userEvent,
    );
    const result = await this.commentRepository.update(
      { id: idComment },
      newcomment,
    );

    if (result.affected === 0) throw new NotFoundException();

    return {
      message: `${typesMessages.COMMENT} ${idComment} ${typesMessages.UPDATED}`,
    };
  }

  async getComment(
    id: number,
    username: string,
    idComment: number,
  ): Promise<{ result: Comment; message: string }> {
    await this.eventService.validateEvent(id, username);
    const comment = await this.commentRepository.getComment(idComment);
    if (!comment) throw new NotFoundException();

    return {
      message: ``,
      result: comment,
    };
  }

  async getAllComments(
    id: number,
    username: string,
  ): Promise<{ result: Comment[]; message: string }> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventById(id);
    return { message: '', result: event.comments };
  }
}
