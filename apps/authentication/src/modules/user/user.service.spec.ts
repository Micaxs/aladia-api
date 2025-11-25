import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { LoggerService } from '@core/logger/logger.service';

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

  describe('findById', () => {
    it('should return mapped user when found', async () => {
      userRepository.findById = jest.fn().mockResolvedValue({
        _id: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      } as any) as any;

      const result = await (service as any).findById('1');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      });
    });

    it('should return null when user not found', async () => {
      userRepository.findById = jest.fn().mockResolvedValue(null as any) as any;

      const result = await (service as any).findById('missing');

      expect(userRepository.findById).toHaveBeenCalledWith('missing');
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return mapped user when found', async () => {
      userRepository.findByUsername.mockResolvedValue({
        _id: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      } as any);

      const result = await service.findByUsername('john');

      expect(userRepository.findByUsername).toHaveBeenCalledWith('john');
      expect(result).toEqual({
        id: '1',
        username: 'john',
        email: 'john@example.com',
        active: true,
        country: 'US',
      });
    });

    it('should return null when user not found', async () => {
      userRepository.findByUsername.mockResolvedValue(null as any);

      const result = await service.findByUsername('missing');

      expect(userRepository.findByUsername).toHaveBeenCalledWith('missing');
      expect(result).toBeNull();
    });
  });

  describe('update and delete', () => {
    it('should update user fields when found', async () => {
      const user: any = {
        _id: { toString: () => '1' },
        username: 'john',
        email: 'old@example.com',
        active: true,
        country: 'US',
        save: jest.fn().mockResolvedValue({
          _id: { toString: () => '1' },
          username: 'john',
          email: 'new@example.com',
          active: false,
          country: 'CA',
        }),
      };

      (userRepository as any).findById = jest.fn().mockResolvedValue(user);

      const result = await service.update('1', {
        email: 'new@example.com',
        active: false,
        country: 'CA',
      });

      expect((userRepository as any).findById).toHaveBeenCalledWith('1');
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        username: 'john',
        email: 'new@example.com',
        active: false,
        country: 'CA',
      });
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      (userRepository as any).findById = jest.fn().mockResolvedValue(null);

      await expect(
        service.update('missing', { email: 'new@example.com' }),
      ).rejects.toThrow('User not found');
    });

    it('should delete user when found', async () => {
      const deleteOne = jest.fn().mockResolvedValue(undefined);
      (userRepository as any).findById = jest.fn().mockResolvedValue({ deleteOne });

      await service.delete('1');

      expect((userRepository as any).findById).toHaveBeenCalledWith('1');
      expect(deleteOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when deleting non-existent user', async () => {
      (userRepository as any).findById = jest.fn().mockResolvedValue(null);

      await expect(service.delete('missing')).rejects.toThrow('User not found');
    });
  });
});
