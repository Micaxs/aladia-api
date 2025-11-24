import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController (microservice)', () => {
  let controller: UserController;
  let userService: UserService;

  const userServiceMock = {
    register: jest.fn(),
    listUsers: jest.fn(),
    findById: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should delegate register to UserService with correct arguments', async () => {
    (userService.register as jest.Mock).mockResolvedValue('created');

    const payload = { username: 'u', password: 'p', email: 'e', active: true, country: 'c' };
    const result = await controller.register(payload);

    expect(userService.register).toHaveBeenCalledWith('u', 'p', 'e', true, 'c');
    expect(result).toBe('created');
  });

  it('should delegate users to UserService.listUsers', async () => {
    (userService.listUsers as jest.Mock).mockResolvedValue(['user']);

    const result = await controller.users();

    expect(userService.listUsers).toHaveBeenCalled();
    expect(result).toEqual(['user']);
  });

  it('should delegate userById to UserService.findById', async () => {
    (userService.findById as jest.Mock).mockResolvedValue('user');

    const result = await controller.userById({ id: '123' });

    expect(userService.findById).toHaveBeenCalledWith('123');
    expect(result).toBe('user');
  });

  it('should delegate userByUsername to UserService.findByUsername', async () => {
    (userService.findByUsername as jest.Mock).mockResolvedValue('user');

    const result = await controller.userByUsername({ username: 'john' });

    expect(userService.findByUsername).toHaveBeenCalledWith('john');
    expect(result).toBe('user');
  });

  it('should delegate updateUser to UserService.update with id and updates', async () => {
    (userService.update as jest.Mock).mockResolvedValue('updated');

    const payload = { id: '123', email: 'e', active: false, country: 'c' };
    const result = await controller.updateUser(payload);

    expect(userService.update).toHaveBeenCalledWith('123', { email: 'e', active: false, country: 'c' });
    expect(result).toBe('updated');
  });

  it('should delegate deleteUser to UserService.delete', async () => {
    (userService.delete as jest.Mock).mockResolvedValue(undefined);

    await controller.deleteUser({ id: '123' });

    expect(userService.delete).toHaveBeenCalledWith('123');
  });
});
