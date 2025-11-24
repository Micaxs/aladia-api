import { Model } from 'mongoose';
import { UserRepository } from './user.repository';
import { User, UserDocument } from './schemas/user.schema';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    const model = {
      findById: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as any;

    repository = new UserRepository(model as unknown as Model<UserDocument>);
  });

  it('create should instantiate and save user', async () => {
    const save = jest.fn().mockResolvedValue({} as UserDocument);
    const NewModel: any = function (this: any, data: any) {
      Object.assign(this, data);
      this.save = save;
    };

    repository = new UserRepository(NewModel as any);

    const result = await repository.create('u', 'hash', 'e', true, 'c');

    expect(save).toHaveBeenCalled();
    expect(result).toEqual({} as UserDocument);
  });

  it('findById should call model.findById().exec()', async () => {
    const exec = jest.fn().mockResolvedValue('user' as any);
    (repository as any).userModel.findById.mockReturnValue({ exec });

    const result = await repository.findById('id');

    expect((repository as any).userModel.findById).toHaveBeenCalledWith('id');
    expect(exec).toHaveBeenCalled();
    expect(result).toBe('user');
  });

  it('findByUsername should call model.findOne().exec()', async () => {
    const exec = jest.fn().mockResolvedValue('user' as any);
    (repository as any).userModel.findOne.mockReturnValue({ exec });

    const result = await repository.findByUsername('name');

    expect((repository as any).userModel.findOne).toHaveBeenCalledWith({ username: 'name' });
    expect(exec).toHaveBeenCalled();
    expect(result).toBe('user');
  });

  it('findAll should call model.find().exec()', async () => {
    const exec = jest.fn().mockResolvedValue(['user'] as any);
    (repository as any).userModel.find.mockReturnValue({ exec });

    const result = await repository.findAll();

    expect((repository as any).userModel.find).toHaveBeenCalled();
    expect(exec).toHaveBeenCalled();
    expect(result).toEqual(['user']);
  });
});
