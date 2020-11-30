import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { repositoryMockFactory } from './fakeRepository/authrepositoryfake';
import { MockType } from './fakeRepository/MockType';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

describe('CatsController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let repositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'topSecret51',
          signOptions: {
            expiresIn: 30000,
          },
        }),
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
    repositoryMock = moduleRef.get(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      // @ts-ignore
      const user: User = {
        id: 23,
        username: 'test user',
        password: 'eqw',
        salt: 'eqw',
      };

      const result = await { message: 'prueba', result: user };
      const authCredentials: AuthCredentialsDto = {
        username: 'USER TEST',
        password: 'PASSWORD',
      };
      // @ts-ignore
      jest.spyOn(authService, 'signUp').mockImplementation(() => result);

      expect(await authService.signUp(authCredentials)).toBe(result);
    });
  });
});
