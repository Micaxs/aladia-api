import { Test } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { AuthenticationAppModule } from './authentication-app.module';

describe('AuthenticationAppModule', () => {
  it('should compile the module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthenticationAppModule],
    })
      .overrideProvider(getConnectionToken())
      .useValue({})
      .overrideProvider(getModelToken('User'))
      .useValue({})
      .compile();

    expect(moduleRef).toBeDefined();
  });
});
