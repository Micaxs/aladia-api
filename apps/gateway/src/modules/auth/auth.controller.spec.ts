import { Test, TestingModule } from '@nestjs/testing';
import { AuthHttpController } from './auth.controller';
import { NetworkingService } from '@core/networking/networking.service';
import { RegisterUserDto } from '@common/dto/register-user.dto';
import { LoginDto } from '@common/dto/login.dto';

describe('AuthHttpController', () => {
  let controller: AuthHttpController;
  let networkingService: jest.Mocked<NetworkingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthHttpController],
      providers: [
        {
          provide: NetworkingService,
          useValue: {
            sendAuth: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthHttpController>(AuthHttpController);
    networkingService = module.get(NetworkingService);
  });

  describe('register', () => {
    it('should forward to auth_register and return result', async () => {
      const dto: RegisterUserDto = {
        username: 'john',
        password: 'password',
        email: 'john@example.com',
        active: true,
        country: 'US',
      };
      const user = {
        id: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      };
      networkingService.sendAuth.mockResolvedValue(user as any);

      const result = await controller.register(dto);

      expect(networkingService.sendAuth).toHaveBeenCalledWith('auth_register', dto);
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should forward to auth_login and return token', async () => {
      const dto: LoginDto = { username: 'john', password: 'password' };
      const token = { accessToken: 'token' };
      networkingService.sendAuth.mockResolvedValue(token as any);

      const result = await controller.login(dto);

      expect(networkingService.sendAuth).toHaveBeenCalledWith('auth_login', dto);
      expect(result).toEqual(token);
    });
  });

  describe('findAll', () => {
    it('should forward to auth_users and return users', async () => {
      const users = [
        { id: '1', username: 'john', email: 'john@example.com', active: true, country: 'US' },
        { id: '2', username: 'jane', email: 'jane@example.com', active: true, country: 'UK' },
      ];
      networkingService.sendAuth.mockResolvedValue(users as any);

      const result = await controller.findAll();

      expect(networkingService.sendAuth).toHaveBeenCalledWith('auth_users', {});
      expect(result).toEqual(users);
    });
  });
});
