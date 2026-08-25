import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../entities/permission.entity';

/**
 * Permission Guard — Layer 1 of the three-layer access control (Section 4).
 *
 * Checks: Does the user's role(s) include at least one of the required permissions?
 *
 * This guard runs AFTER JwtAuthGuard (which populates request.user).
 * If no @RequirePermissions() decorator is present, the route is allowed
 * (it still requires authentication via JwtAuthGuard unless @Public()).
 *
 * Section 4: "Every single API endpoint must independently re-check
 * role + data scope + field scope, and log denied privileged attempts."
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  // In-memory cache of role → permission codes (rebuilt on first call, cached thereafter)
  private rolePermissionCache: Map<string, Set<string>> | null = null;
  private cacheBuiltAt: number = 0;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rpRepo: Repository<RolePermission>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no @RequirePermissions on the route, allow (auth is still enforced by JwtAuthGuard)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles || user.roles.length === 0) {
      throw new ForbiddenException('No roles assigned. Access denied.');
    }

    // Build/refresh permission cache
    const permissionMap = await this.getPermissionMap();

    // Check if ANY of the user's roles has ANY of the required permissions
    const userPermissions = new Set<string>();
    for (const roleCode of user.roles) {
      const rolePerms = permissionMap.get(roleCode);
      if (rolePerms) {
        for (const perm of rolePerms) {
          userPermissions.add(perm);
        }
      }
    }

    const hasPermission = requiredPermissions.some((p) => userPermissions.has(p));

    if (!hasPermission) {
      // Log denied privileged attempts (Section 4)
      console.warn(
        `[PERMISSION DENIED] User ${user.id} (${user.email}) ` +
        `roles=[${user.roles.join(',')}] ` +
        `attempted=${requiredPermissions.join(',')} ` +
        `path=${request.method} ${request.url}`,
      );

      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    // Attach resolved permissions to request for downstream use
    request.userPermissions = userPermissions;

    return true;
  }

  /**
   * Build a map of roleCode → Set<permissionCode> from the database.
   * Cached in memory with a 5-minute TTL to avoid per-request DB queries.
   */
  private async getPermissionMap(): Promise<Map<string, Set<string>>> {
    const now = Date.now();
    if (this.rolePermissionCache && now - this.cacheBuiltAt < this.CACHE_TTL_MS) {
      return this.rolePermissionCache;
    }

    const roles = await this.roleRepo.find({ where: { isActive: true } });
    const permissions = await this.permRepo.find({ where: { isActive: true } });
    const rolePermissions = await this.rpRepo.find({ where: { isActive: true } });

    const permCodeById = new Map<string, string>();
    for (const perm of permissions) {
      permCodeById.set(perm.id, perm.code);
    }

    const roleCodeById = new Map<string, string>();
    for (const role of roles) {
      roleCodeById.set(role.id, role.code);
    }

    const map = new Map<string, Set<string>>();
    for (const rp of rolePermissions) {
      const roleCode = roleCodeById.get(rp.roleId);
      const permCode = permCodeById.get(rp.permissionId);
      if (!roleCode || !permCode) continue;

      if (!map.has(roleCode)) {
        map.set(roleCode, new Set());
      }
      map.get(roleCode)!.add(permCode);
    }

    this.rolePermissionCache = map;
    this.cacheBuiltAt = now;
    return map;
  }

  /**
   * Force cache refresh — call after role/permission changes.
   */
  invalidateCache(): void {
    this.rolePermissionCache = null;
    this.cacheBuiltAt = 0;
  }
}
