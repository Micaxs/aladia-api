import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { type Cache, createCache } from 'cache-manager';
import { NetworkingService } from '@core/networking/networking.service';
import { RegisterUserDto } from '@common/dto/register-user.dto';
import { UserRto } from '@common/rto/user.rto';
import { LoginDto } from '@common/dto/login.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import configuration from '@config/configuration';

@ApiTags('auth')
@Controller('auth')
export class AuthHttpController {
  constructor(
    private readonly networkingService: NetworkingService,
  ) {}

  // Caching Manager 
  // (For bigger application, would probably move to its own service or use something like redis to store responses)
  private cacheManager?: Cache;
  private readonly cacheTtlMs: number = configuration().cacheTtlMs;

  private async getCacheManager(): Promise<Cache> {
    if (!this.cacheManager) {
      this.cacheManager = createCache({ ttl: this.cacheTtlMs });
    }
    return this.cacheManager;
  }

  // POST /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    try {
      return await this.networkingService.sendAuth<LoginDto, { accessToken: string }>('auth_login', dto);
    } catch (err: any) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // POST /auth/register
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto): Promise<UserRto> {
    const user = await this.networkingService.sendAuth<RegisterUserDto, UserRto>('auth_register', dto);
    const cache = await this.getCacheManager();
    await cache.del('users:all');
    await cache.del(`users:${user.id}`);
    return user;
  }


  // GET /auth/users (requires authentication token)
  @Get('users')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserRto, isArray: true })
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UserRto[]> {
    const cache = await this.getCacheManager();
    const cacheKey = 'users:all';
    const cached = await cache.get<UserRto[]>(cacheKey);
    if (cached) {
      return cached;
    }
    const users = await this.networkingService.sendAuth<Record<string, never>, UserRto[]>('auth_users', {});
    await cache.set(cacheKey, users, this.cacheTtlMs);
    return users;
  }

  // GET /auth/users/:id (requires authentication token)
  @Get('users/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserRto })
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<UserRto | null> {
    const cache = await this.getCacheManager();
    const cacheKey = `users:${id}`;
    const cached = await cache.get<UserRto | null>(cacheKey);
    if (cached) {
      return cached;
    }
    const user = await this.networkingService.sendAuth<{ id: string }, UserRto | null>('auth_user_by_id', { id });
    if (user) {
      await cache.set(cacheKey, user, this.cacheTtlMs);
    }
    return user;
  }

  // GET /auth/user?username= (requires authentication token)
  @Get('user')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserRto })
  @ApiQuery({ name: 'username', required: true })
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Query('username') username: string): Promise<UserRto | null> {
    return this.networkingService.sendAuth<{ username: string }, UserRto | null>('auth_user_by_username', { username });
  }
}

