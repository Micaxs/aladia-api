import configuration from './configuration';

describe('configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return defaults when env vars are not set', () => {
    delete process.env.GATEWAY_PORT;
    delete process.env.AUTH_HOST;
    delete process.env.AUTH_PORT;
    delete process.env.MONGO_URI;
    delete process.env.JWT_SECRET;
    delete process.env.CACHE_TTL_MS;

    const config = configuration();

    expect(config.gatewayPort).toBe(3000);
    expect(config.authHost).toBe('authentication');
    expect(config.authPort).toBe(4001);
    expect(config.mongoUri).toBe('mongodb://mongo:27017/aladia_auth');
    expect(config.jwtSecret).toBe('');
    expect(config.cacheTtlMs).toBe(60000);
  });

  it('should parse values from environment variables', () => {
    process.env.GATEWAY_PORT = '1234';
    process.env.AUTH_HOST = 'custom-auth';
    process.env.AUTH_PORT = '5678';
    process.env.MONGO_URI = 'mongodb://example:27017/db';
    process.env.JWT_SECRET = 'supersecret';
    process.env.CACHE_TTL_MS = '90000';

    const config = configuration();

    expect(config.gatewayPort).toBe(1234);
    expect(config.authHost).toBe('custom-auth');
    expect(config.authPort).toBe(5678);
    expect(config.mongoUri).toBe('mongodb://example:27017/db');
    expect(config.jwtSecret).toBe('supersecret');
    expect(config.cacheTtlMs).toBe(90000);
  });
});
