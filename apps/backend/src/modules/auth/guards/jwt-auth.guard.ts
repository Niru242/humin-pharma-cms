import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from '../token.service';
import { User } from '../entities/user.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT Auth Guard — validates the access token on every protected request.
 *
 * Section 4: "Every single API endpoint must independently re-check role + data scope"
 * This guard handles token validity and token version verification.
 * Permission/scope checks happen in a separate PermissionGuard (Substep 4).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const payload = this.tokenService.verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    // Verify token version hasn't been revoked (force logout / password change)
    const user = await this.userRepo.findOne({
      where: { id: payload.sub, isActive: true },
      select: ['id', 'tokenVersion', 'isActive'],
    });

    if (!user) {
      throw new UnauthorizedException('User account not found or inactive');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Session revoked. Please login again.');
    }

    // Attach user info to request for downstream use
    request.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roleIds,
      dataScope: payload.dataScope,
      tokenVersion: payload.tokenVersion,
    };

    return true;
  }
}
