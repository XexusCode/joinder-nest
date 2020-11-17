import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthMapping } from './authMapping/AuthMapping';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const user = await AuthMapping.toEntity(authCredentialsDto);
    return this.userRepository.signUp(user);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username } = authCredentialsDto;

    const user = await this.userRepository.getUserFromUsername(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await this.validatePassword(authCredentialsDto.password, user))) {
      throw new UnauthorizedException('Invalid credentials');
    } else {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    }
  }

  async validatePassword(password: string, user: User): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }
}
