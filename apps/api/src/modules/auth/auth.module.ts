import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { UserDataScope } from './entities/user-data-scope.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuditEvent } from '../audit/entities/audit-event.entity';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { MfaService } from './mfa.service';
import { DataScopeService } from './services/data-scope.service';
import { FieldAccessService } from './services/field-access.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { AccessLogInterceptor } from './interceptors/access-log.interceptor';

/**
 * Auth Module — provides the full three-layer access control stack (Section 4):
 *
 * Layer 1: Role → Permission (PermissionGuard, applied globally)
 * Layer 2: Data Scope (DataScopeService, applied at query level in services)
 * Layer 3: Field-Level Sensitivity (FieldAccessService, applied in response mapping)
 *
 * Guards execute in order:
 * 1. ThrottlerGuard — rate limiting
 * 2. JwtAuthGuard — token validation + user attachment
 * 3. PermissionGuard — role → permission check
 *
 * @Public() skips all three guards.
 * Routes without @RequirePermissions() still require authentication.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      RolePermission,
      UserRole,
      UserDataScope,
      RefreshToken,
      AuditEvent,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    TokenService,
    MfaService,
    DataScopeService,
    FieldAccessService,
    AccessLogInterceptor,

    // Global guards (execution order: Throttler → JWT → Permission)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [
    AuthService,
    TokenService,
    DataScopeService,
    FieldAccessService,
    AccessLogInterceptor,
    TypeOrmModule,
  ],
})
export class AuthModule {}
