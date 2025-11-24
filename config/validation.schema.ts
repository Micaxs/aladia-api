import * as Joi from 'joi';

export const validationSchema = Joi.object({
  GATEWAY_PORT: Joi.number().port().optional(),
  AUTH_HOST: Joi.string().optional(),
  AUTH_PORT: Joi.number().port().optional(),
  MONGO_URI: Joi.string().uri().optional(),
  JWT_SECRET: Joi.string().min(8).required(),
  CACHE_TTL_MS: Joi.number().integer().min(0).optional(),
});
