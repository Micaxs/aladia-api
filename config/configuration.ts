export interface AppConfig {
  gatewayPort: number;
  authHost: string;
  authPort: number;
  mongoUri: string;
  jwtSecret: string;
  cacheTtlMs: number;
}

export default (): AppConfig => ({
  gatewayPort: parseInt(process.env.GATEWAY_PORT ?? '3000', 10),
  authHost: process.env.AUTH_HOST ?? 'authentication',
  authPort: parseInt(process.env.AUTH_PORT ?? '4001', 10),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://mongo:27017/aladia_auth',
  jwtSecret: process.env.JWT_SECRET ?? '',
  cacheTtlMs: parseInt(process.env.CACHE_TTL_MS ?? '60000', 10),
});
