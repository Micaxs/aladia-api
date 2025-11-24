import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { GatewayAppModule } from '../apps/gateway/src/gateway-app.module';
import { NetworkingService } from '@core/networking/networking.service';
import { JwtAuthGuard } from '../apps/gateway/src/auth/jwt-auth.guard';

describe('Gateway API e2e (gateway only with mocks)', () => {
  let app: INestApplication;
  let networkingService: jest.Mocked<NetworkingService>;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayAppModule],
    })
      .overrideProvider(NetworkingService)
      .useValue({
        sendAuth: jest.fn(),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    networkingService = app.get(NetworkingService) as jest.Mocked<NetworkingService>;
  });

  afterAll(async () => {
    await app.close();
  });

  
  it('registers, logs in, and fetches users (via mocks)', async () => {
    const username = `user_${Date.now()}`;
    const password = 'password123';

    (networkingService.sendAuth as jest.Mock)
      // Register Mock
      .mockResolvedValueOnce({ id: '1', username })
      // Get Users Mock
      .mockResolvedValueOnce([{ id: '1', username }]);

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password })
      .expect(201);

    expect(registerRes.body).toHaveProperty('id');
    expect(registerRes.body).toMatchObject({ username });

    const usersRes = await request(app.getHttpServer())
      .get('/auth/users')
      .expect(200);

    expect(usersRes.body).toEqual([{ id: '1', username }]);

    expect(networkingService.sendAuth).toHaveBeenNthCalledWith(1, 'auth_register', {
      username,
      password,
    });
    expect(networkingService.sendAuth).toHaveBeenNthCalledWith(2, 'auth_users', {});
  });
});
