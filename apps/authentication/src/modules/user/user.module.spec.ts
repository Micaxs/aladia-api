import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getModelToken('User'))
      .useValue({})
      .compile();
  });

  it('should compile module and provide services', () => {
    expect(moduleRef).toBeDefined();
    expect(moduleRef.get(UserRepository)).toBeDefined();
    expect(moduleRef.get(UserService)).toBeDefined();
  });
});
