import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { NetworkingModule } from '@core/networking/networking.module';
import { AuthHttpModule } from './modules/auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    NetworkingModule,
    AuthHttpModule,
  ],
  providers: [JwtStrategy],
})
export class GatewayAppModule {}
