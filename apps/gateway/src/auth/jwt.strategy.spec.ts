import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('should be defined and use secret from config', () => {
    const configService = {
      get: jest.fn().mockReturnValue('secret'),
    } as unknown as ConfigService;

    const strategy = new JwtStrategy(configService);

    expect(strategy).toBeDefined();
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('should validate payload and map to user object', async () => {
    const configService = {
      get: jest.fn().mockReturnValue('secret'),
    } as unknown as ConfigService;

    const strategy = new JwtStrategy(configService);

    const result = await strategy.validate({ sub: '1', username: 'user' });

    expect(result).toEqual({ userId: '1', username: 'user' });
  });
});
