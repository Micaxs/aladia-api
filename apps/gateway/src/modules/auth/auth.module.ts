import { Module } from '@nestjs/common';
import { NetworkingModule } from '@core/networking/networking.module';
import { AuthHttpController } from './auth.controller';

@Module({
  imports: [NetworkingModule],
  controllers: [AuthHttpController],
})
export class AuthHttpModule {}
