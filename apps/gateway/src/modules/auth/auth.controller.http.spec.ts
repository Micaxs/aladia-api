import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthHttpModule } from './auth.module';
import { AuthHttpController } from './auth.controller';
import { NetworkingService } from '@core/networking/networking.service';
import configuration from '@config/configuration';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

jest.mock('@config/configuration');

describe('AuthHttpController (e2e-like)', () => {
  let app: INestApplication;
  let networkingService: NetworkingService;

  beforeEach(async () => {
    (configuration as jest.Mock).mockReturnValue({ cacheTtlMs: 50 });

    const networkingServiceMock = {
      sendAuth: jest.fn(),
    } as unknown as NetworkingService;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthHttpModule],
    })
      .overrideProvider(NetworkingService)
      .useValue(networkingServiceMock)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    networkingService = app.get(NetworkingService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/login should return token on success', async () => {
    (networkingService.sendAuth as jest.Mock).mockResolvedValue({ accessToken: 'token' });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'user', password: 'pass' })
      .expect(200)
      .expect({ accessToken: 'token' });
  });

  it('POST /auth/login should throw UnauthorizedException on error', async () => {
    (networkingService.sendAuth as jest.Mock).mockRejectedValue(new Error('boom'));

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'user', password: 'wrong' })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('POST /auth/register should clear cache keys and return user', async () => {
    const user = { id: '1', username: 'u' };
    (networkingService.sendAuth as jest.Mock).mockResolvedValue(user);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'u', password: 'p', email: 'e@example.com', active: true, country: 'c' })
      .expect(201)
      .expect(user);
  });

  it('GET /auth/users should use cache on subsequent calls', async () => {
    const users = [{ id: '1', username: 'u' }];
    (networkingService.sendAuth as jest.Mock).mockResolvedValue(users);

    await request(app.getHttpServer()).get('/auth/users').expect(200).expect(users);

    (networkingService.sendAuth as jest.Mock).mockClear();

    await request(app.getHttpServer()).get('/auth/users').expect(200).expect(users);

    expect(networkingService.sendAuth).not.toHaveBeenCalled();
  });

  it('GET /auth/users/:id should use cache on subsequent calls', async () => {
    const user = { id: '1', username: 'u' };
    (networkingService.sendAuth as jest.Mock).mockResolvedValue(user);

    await request(app.getHttpServer()).get('/auth/users/1').expect(200).expect(user);

    (networkingService.sendAuth as jest.Mock).mockClear();

    await request(app.getHttpServer()).get('/auth/users/1').expect(200).expect(user);

    expect(networkingService.sendAuth).not.toHaveBeenCalled();
  });

  it('GET /auth/user should proxy to networkingService', async () => {
    const user = { id: '1', username: 'u' };
    (networkingService.sendAuth as jest.Mock).mockResolvedValue(user);

    await request(app.getHttpServer()).get('/auth/user').query({ username: 'u' }).expect(200).expect(user);

    expect(networkingService.sendAuth).toHaveBeenCalledWith('auth_user_by_username', { username: 'u' });
  });
});
