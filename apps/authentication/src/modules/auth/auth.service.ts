import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/user.repository';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository, 
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      this.logger.warn(`Invalid login attempt for user: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Invalid login attempt for user: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      active: user.active,
      country: user.country,
    };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      active: user.active,
      country: user.country,
    };

    try {
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch (error) {
      this.logger.error('Failed generating access token');
      throw new UnauthorizedException('Could not generate access token');
    }
  }
}
