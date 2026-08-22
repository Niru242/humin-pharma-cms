import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, ChangePasswordDto } from './dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, RequestUser } from './decorators/current-user.decorator';

/**
 * Auth controller — all authentication endpoints.
 *
 * Section 4 + Section 9:
 * - POST /v1/auth/login         — public, rate-limited aggressively
 * - POST /v1/auth/refresh       — public, rate-limited
 * - POST /v1/auth/logout        — public (accepts invalid tokens gracefully)
 * - POST /v1/auth/change-password — authenticated
 * - POST /v1/auth/mfa/setup     — authenticated
 * - POST /v1/auth/mfa/verify    — authenticated
 * - POST /v1/auth/mfa/disable   — authenticated
 * - POST /v1/auth/force-logout  — authenticated (admin only)
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 login attempts per minute per IP
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.login(dto, ip, userAgent);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } }) // 10 refresh attempts per minute
  async refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.refresh(dto, ip, userAgent);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: RequestUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, dto);
  }

  @Post('mfa/setup')
  @HttpCode(HttpStatus.OK)
  async setupMfa(@CurrentUser() user: RequestUser) {
    return this.authService.setupMfa(user.id);
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMfaSetup(
    @CurrentUser() user: RequestUser,
    @Body('code') code: string,
  ) {
    return this.authService.verifyMfaSetup(user.id, code);
  }

  @Post('mfa/disable')
  @HttpCode(HttpStatus.OK)
  async disableMfa(@CurrentUser() user: RequestUser) {
    return this.authService.disableMfa(user.id);
  }

  @Post('force-logout')
  @HttpCode(HttpStatus.OK)
  async forceLogout(
    @CurrentUser() user: RequestUser,
    @Body('targetUserId') targetUserId: string,
    @Body('reason') reason: string,
  ) {
    // TODO: Add permission check (user.force_logout) in Substep 4
    return this.authService.forceLogout(targetUserId, reason);
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: RequestUser) {
    return { user };
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }
}
