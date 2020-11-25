import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entity/user.entity';

describe('CatsController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
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

      expect(await authController.signUp(authCredentials)).toBe(result);
    });
  });
});
