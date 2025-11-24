import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findByUsername: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  describe('register', () => {
    it('should create a new user when username is free', async () => {
      userRepository.findByUsername.mockResolvedValue(null as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      userRepository.create.mockResolvedValue({
        _id: '123',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      } as any);

      const result = await service.register('john', 'password', 'john@example.com', undefined as any, 'US');

      expect(userRepository.findByUsername).toHaveBeenCalledWith('john');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(userRepository.create).toHaveBeenCalledWith('john', 'hashed', 'john@example.com', true, 'US');
      expect(result).toEqual({
        id: '123',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      userRepository.findByUsername.mockResolvedValue({
        _id: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      } as any);

      await expect(
        service.register('john', 'password', 'john@example.com', undefined as any, 'US'),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('listUsers', () => {
    it('should return mapped users', async () => {
      userRepository.findAll.mockResolvedValue([
        { _id: '1', username: 'john', email: 'john@example.com', active: true, country: 'US' },
        { _id: '2', username: 'jane', email: 'jane@example.com', active: false, country: 'UK' },
      ] as any);

      const result = await service.listUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: '1', username: 'john', email: 'john@example.com', active: true, country: 'US' },
        { id: '2', username: 'jane', email: 'jane@example.com', active: false, country: 'UK' },
      ]);
    });
  });
});
