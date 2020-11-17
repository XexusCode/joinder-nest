import { EntityRepository, Repository } from 'typeorm';

import { Comment } from '../entity/comments.entity';

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async addComment(comment: Comment): Promise<Comment> {
    comment.save();

    return comment;
  }
  async prueba() {
    console.log(this);
  }

  getComment(idComment: number): Promise<Comment> {
    return this.findOne({ id: idComment });
  }
}
