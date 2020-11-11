import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepositoty } from './comments.repositoty';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comments.entity';
import { Event } from '../events/event.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepositoty)
    private commentRepository: CommentsRepositoty,
  ) {}

  async addComment(createCommentDto: CreateCommentDto, id): Promise<Comment> {
    return this.commentRepository.addComment(createCommentDto, id);
  }

  async deleteComment(event: Event, idComment: number): Promise<void> {
    const result = await this.commentRepository.delete({ id: idComment });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${event.id}" not found`);
    }
  }

  async updateComment(
    event: Event,
    idComment: number,
    createEventDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    const updatedcomment = new Comment();
    updatedcomment.text = createEventDto.text;
    updatedcomment.date = createEventDto.date;
    const result = await this.commentRepository.update(
      { id: idComment },
      updatedcomment,
    );
    console.log(result);
    return createEventDto;
  }
}
