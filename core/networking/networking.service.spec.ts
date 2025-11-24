import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { NetworkingService } from './networking.service';

describe('NetworkingService', () => {
  let service: NetworkingService;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const clientProxyMock = {
      send: jest.fn(),
    } as unknown as ClientProxy;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworkingService,
        {
          provide: 'AUTH_SERVICE',
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    service = module.get<NetworkingService>(NetworkingService);
    clientProxy = module.get<ClientProxy>('AUTH_SERVICE');
  });

  it('should send message with pattern and payload and return response', async () => {
    (clientProxy.send as jest.Mock).mockReturnValue(of('response'));

    const result = await service.sendAuth<{ foo: string }, string>('pattern', { foo: 'bar' });

    expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'pattern' }, { foo: 'bar' });
    expect(result).toBe('response');
  });

  it('should use empty object as default payload', async () => {
    (clientProxy.send as jest.Mock).mockReturnValue(of('ok'));

    const result = await service.sendAuth<undefined, string>('pattern');

    expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'pattern' }, {} as unknown as undefined);
    expect(result).toBe('ok');
  });
});
