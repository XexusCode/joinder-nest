import { Repository, EntityRepository } from 'typeorm';
import { ConflictException } from '@nestjs/common';

import { User } from '../entity/user.entity';
import { typesMessages } from '../types/types.messages';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(user: User): Promise<User> {
    try {
      return await user.save();
    } catch {
      throw new ConflictException(typesMessages.DUPLICATE);
    }
  }

  async getUserFromUsername(username: string): Promise<User> {
    return await this.findOne({ username });
  }
}
