import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

// Domain modules
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ImportJobsModule } from './modules/import-jobs/import-jobs.module';
import { DataRetentionModule } from './modules/data-retention/data-retention.module';
import { MigrationToolModule } from './modules/migration-tool/migration-tool.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { TimeAttendanceModule } from './modules/time-attendance/time-attendance.module';
import { LeaveModule } from './modules/leave/leave.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'pharma_hrms'),
        autoLoadEntities: true,
        synchronize: true,
        charset: 'utf8mb4',
        logging: config.get('APP_ENV') === 'development' ? ['error', 'warn'] : ['error'],
      }),
    }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
    ]),

    // Foundation
    AuthModule,
    AuditModule,
    WorkflowModule,
    DocumentsModule,
    NotificationsModule,
    SearchModule,
    ProfileModule,
    ImportJobsModule,
    DataRetentionModule,
    MigrationToolModule,

    // Core HR
    OrganizationModule,
    TimeAttendanceModule,
    LeaveModule,

    // Always last
    HealthModule,
    OrganizationModule,
  ],
})
export class AppModule {}
