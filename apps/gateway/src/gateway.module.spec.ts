import { Test } from '@nestjs/testing';
import { GatewayAppModule } from './gateway.module';

describe('GatewayAppModule', () => {
  it('should compile the module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GatewayAppModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});
