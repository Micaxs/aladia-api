import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { LoggerService } from '@core/logger/logger.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      userRepository.findByUsername.mockResolvedValue({ _id: '1', username: 'john', passwordHash: 'hash' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('john', 'password');

      expect(userRepository.findByUsername).toHaveBeenCalledWith('john');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hash');
      expect(result).toEqual({ id: '1', username: 'john' });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      userRepository.findByUsername.mockResolvedValue(null as any);

      await expect(service.validateUser('john', 'password')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userRepository.findByUsername.mockResolvedValue({ _id: '1', username: 'john', passwordHash: 'hash' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('john', 'password')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue({
        id: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      } as any);
      jwtService.signAsync.mockResolvedValue('token');

      const result = await service.login('john', 'password');

      expect(service.validateUser).toHaveBeenCalledWith('john', 'password');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      });
      expect(result).toEqual({ accessToken: 'token' });
    });
  });
});
