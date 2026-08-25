import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEvent } from '../../audit/entities/audit-event.entity';

/**
 * Access Log Interceptor — logs access to sensitive records.
 *
 * Section 5: "Log all access to Confidential-tier records (not just changes)
 * for review by Auditor/QA roles."
 *
 * Apply to controllers/routes that handle confidential data
 * (medical records, disciplinary cases, salary details).
 *
 * Usage:
 *   @UseInterceptors(AccessLogInterceptor)
 *   @Get(':id/medical')
 *   getMedicalRecord(...) { }
 */
@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditEvent)
    private readonly auditRepo: Repository<AuditEvent>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;
    const entityId = request.params?.id;

    return next.handle().pipe(
      tap(async () => {
        // Only log read-access (GET requests) — mutations are logged by audit service
        if (method === 'GET' && user) {
          try {
            await this.auditRepo.insert({
              actorId: user.id,
              actorEmail: user.email,
              actorIp: request.ip || request.socket?.remoteAddress,
              action: 'access_confidential',
              module: this.extractModule(url),
              entityType: this.extractEntityType(context),
              entityId: entityId || null,
              outcome: 'success',
              metadata: {
                path: url,
                method,
              },
            });
          } catch (err) {
            // Never fail the request because of audit logging failure
            console.error('[AccessLog] Failed to log access:', err);
          }
        }
      }),
    );
  }

  private extractModule(url: string): string {
    // Extract module from URL: /v1/employees/123/medical → 'employees'
    const parts = url.replace(/^\/v1\//, '').split('/');
    return parts[0] || 'unknown';
  }

  private extractEntityType(context: ExecutionContext): string {
    return context.getClass().name.replace('Controller', '');
  }
}
