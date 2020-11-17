import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '../entity/user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(user: User): Promise<string> {
    try {
      await user.save();
      return 'Success';
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El usuario ya existe');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserFromUsername(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { username } = authCredentialsDto;
    return await this.findOne({ username });
  }
}
