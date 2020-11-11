import { EntityRepository, Repository } from 'typeorm';
import { Event } from '../events/event.entity';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@EntityRepository(Comment)
export class CommentsRepositoty extends Repository<Event> {
  async addComment(
    createCommentDto: CreateCommentDto,
    event: Event,
  ): Promise<Comment> {
    const { text, date } = createCommentDto;

    const comment = new Comment();

    comment.date = date;
    comment.text = text;
    comment.event = event;
    comment.save();

    return comment;
  }
}
