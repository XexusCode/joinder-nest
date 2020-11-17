import { CommentDto } from '../dto/comment.dto';
import { Comment } from '../entity/comments.entity';
import { Event } from '../../events/entity/event.entity';
import { UserEvent } from '../../UserEvent/userEvent.entity';

export class commentMapping {
  static async toEntity(
    commentDto: CommentDto,
    event: Event,
    userEvent: UserEvent,
  ): Promise<Comment> {
    const comment = new Comment();

    comment.text = commentDto.text;
    comment.date = new Date().getTime().toString();
    comment.event = event;
    comment.userEvent = userEvent;
    comment.userEventUsername = userEvent.username;

    return comment;
  }
}
