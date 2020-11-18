import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../interceptor/transform.interceptor';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(TransformInterceptor)
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{
    result: { uid: number; accesstoken: string; username: string };
    message: string;
  }> {
    const { result, message } = await this.authService.signIn(
      authCredentialsDto,
    );

    return { message, result };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/renew')
  async renew(
    @GetUser() user: User,
  ): Promise<{
    result: { uid: number; accesstoken: string; username: string };
    message: string;
  }> {
    const { result, message } = await this.authService.renew(user);
    return { message, result };
  }
}
