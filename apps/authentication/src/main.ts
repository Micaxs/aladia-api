import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationAppModule } from './authentication-app.module';
import { LoggerService } from '@core/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationAppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_HOST || 'authentication',
      port: Number(process.env.AUTH_PORT) || 4001,
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
