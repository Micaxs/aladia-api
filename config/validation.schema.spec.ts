import { validationSchema } from './validation.schema';

describe('validationSchema', () => {
  it('accepts valid configuration', () => {
    const { error, value } = validationSchema.validate({
      GATEWAY_PORT: 3000,
      AUTH_HOST: 'authentication',
      AUTH_PORT: 4001,
      MONGO_URI: 'mongodb://mongo:27017/aladia_auth',
      JWT_SECRET: 'supersecret',
      CACHE_TTL_MS: 60000,
    });

    expect(error).toBeUndefined();
    expect(value.JWT_SECRET).toBe('supersecret');
  });

  it('rejects when JWT_SECRET is missing or too short', () => {
    const { error } = validationSchema.validate({
      GATEWAY_PORT: 3000,
      AUTH_HOST: 'authentication',
      AUTH_PORT: 4001,
      MONGO_URI: 'mongodb://mongo:27017/aladia_auth',
      CACHE_TTL_MS: 60000,
    });

    expect(error).toBeDefined();
  });
});
