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
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { MfaService } from './mfa.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    MfaService,

    // Global JWT auth guard — applies to ALL routes by default.
    // Routes marked with @Public() skip authentication.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Global rate limiter guard — applies throttle limits from @Throttle() decorator
    // or falls back to module-level limits defined in ThrottlerModule.forRoot()
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, TokenService, TypeOrmModule],
})
export class AuthModule {}
