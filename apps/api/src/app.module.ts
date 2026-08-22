import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

// Domain modules
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Environment config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    // Database — PostgreSQL (Section 1 tech stack)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'pharma_admin'),
        password: config.get('DB_PASSWORD', 'pharma_secret_2024'),
        database: config.get('DB_NAME', 'pharma_hrms'),
        autoLoadEntities: true,
        synchronize: false, // Never — use migrations only
        logging: config.get('APP_ENV') === 'development' ? ['error', 'warn'] : ['error'],
      }),
    }),

    // Rate limiting (global defaults)
    // Per-route overrides via @Throttle() decorator
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Domain modules
    AuthModule,
    AuditModule,
    HealthModule,
  ],
})
export class AppModule {}
