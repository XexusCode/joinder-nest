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
  ): Promise<{
    result: { uid: number; accesstoken: string; username: string };
    message: string;
  }> {
    const { username } = authCredentialsDto;

    const user = await this.userRepository.getUserFromUsername(username);

    if (!user) {
      throw new UnauthorizedException(typesMessages.INVALIDCREDENTIALS);
    }

    if (!(await this.validatePassword(authCredentialsDto.password, user))) {
      throw new UnauthorizedException(typesMessages.INVALIDCREDENTIALS);
    } else {
      const payload: JwtPayload = { username };

      return {
        result: {
          accesstoken: this.jwtService.sign(payload),
          uid: user.id,
          username: user.username,
        },
        message: 'prueba',
      };
    }
  }

  async validatePassword(password: string, user: User): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }

  async renew(user: User) {
    const userDatabase = await this.userRepository.getUserFromUsername(
      user.username,
    );
    const { username } = user;

    if (user.password !== userDatabase.password)
      throw new UnauthorizedException();

    const payload: JwtPayload = { username };

    return {
      result: {
        accesstoken: this.jwtService.sign(payload),
        uid: user.id,
        username: user.username,
      },
      message: `${typesMessages.LOGIN}`,
    };
  }
}
