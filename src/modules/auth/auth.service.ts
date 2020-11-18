import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interfaces/auth.interfaces';
import { JwtService } from '@nestjs/jwt';
import { AuthMapping } from './authMapping/AuthMapping';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { typesMessages } from './types/types.messages';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    const user = await AuthMapping.toEntity(authCredentialsDto);

    const result = await this.userRepository.signUp(user);

    if (!result) throw new ConflictException(typesMessages.DUPLICATE);
    else
      return {
        message: `${typesMessages.USER} ${authCredentialsDto.username} ${typesMessages.REGISTER}`,
      };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ result: string; message: string }> {
    const { username } = authCredentialsDto;

    const user = await this.userRepository.getUserFromUsername(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException(typesMessages.INVALIDCREDENTIALS);
    }

    if (!(await this.validatePassword(authCredentialsDto.password, user))) {
      throw new UnauthorizedException(typesMessages.INVALIDCREDENTIALS);
    } else {
      const payload: JwtPayload = { username };

      return {
        result: this.jwtService.sign(payload),
        message: typesMessages.LOGIN,
      };
    }
  }

  async validatePassword(password: string, user: User): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }
}
