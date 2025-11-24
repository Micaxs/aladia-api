import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController (microservice)', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should delegate login to AuthService with correct arguments', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ accessToken: 'token' });

    const result = await controller.login({ username: 'user', password: 'pass' });

    expect(authService.login).toHaveBeenCalledWith('user', 'pass');
    expect(result).toEqual({ accessToken: 'token' });
  });
});
