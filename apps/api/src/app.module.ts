import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

// Domain modules — added as they are built
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

    // Database
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
        synchronize: false, // Never use in production — use migrations
        logging: config.get('APP_ENV') === 'development' ? ['error', 'warn'] : ['error'],
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),

    // Domain modules
    AuthModule,
    AuditModule,
    HealthModule,
  ],
})
export class AppModule {}
