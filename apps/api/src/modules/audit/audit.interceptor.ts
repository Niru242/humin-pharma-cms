import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditService } from './audit.service';

export const AUDIT_ACTION_KEY = 'auditAction';
export const AUDIT_MODULE_KEY = 'auditModuleName';
export const AUDIT_ENTITY_KEY = 'auditEntityType';

/**
 * Metadata decorators for the audit interceptor.
 */
export const AuditAction = (action: string) => SetMetadata(AUDIT_ACTION_KEY, action);
export const AuditModuleName = (module: string) => SetMetadata(AUDIT_MODULE_KEY, module);
export const AuditEntity = (entityType: string) => SetMetadata(AUDIT_ENTITY_KEY, entityType);

/**
 * Audit Interceptor — automatically logs business mutations.
 *
 * Section 3: "Every business mutation is audited. Log actor, record,
 * old value, new value, reason, and timestamp."
 *
 * Applied to controllers that handle business data mutations.
 * Reads metadata from @AuditAction(), @AuditModuleName(), @AuditEntity() decorators.
 *
 * Usage on a controller method:
 *   @AuditAction('create')
 *   @AuditModuleName('employee')
 *   @AuditEntity('Employee')
 *   @Post()
 *   async create(...) { }
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only audit mutations (not GETs)
    if (method === 'GET') {
      return next.handle();
    }

    const user = request.user;
    const handler = context.getHandler();
    const controller = context.getClass();

    // Read audit metadata from decorators
    const action =
      this.reflector.get<string>(AUDIT_ACTION_KEY, handler) ||
      this.inferAction(method);
    const module =
      this.reflector.get<string>(AUDIT_MODULE_KEY, handler) ||
      this.reflector.get<string>(AUDIT_MODULE_KEY, controller) ||
      this.inferModule(request.url);
    const entityType =
      this.reflector.get<string>(AUDIT_ENTITY_KEY, handler) ||
      this.reflector.get<string>(AUDIT_ENTITY_KEY, controller) ||
      controller.name.replace('Controller', '');

    const entityId = request.params?.id || null;
    const reason = request.body?.reason || request.headers['x-audit-reason'] || null;

    return next.handle().pipe(
      tap(async (responseData) => {
        await this.auditService.log({
          actorId: user?.id || null,
          actorEmail: user?.email || null,
          actorIp: request.ip || request.socket?.remoteAddress || null,
          action,
          module,
          entityType,
          entityId: entityId || responseData?.id || null,
          newValues: this.auditService.sanitizeValues(
            this.extractNewValues(request.body),
          ),
          changedFields: request.body ? Object.keys(request.body) : null,
          reason,
          metadata: {
            httpMethod: method,
            path: request.url,
          },
          outcome: 'success',
        });
      }),
    );
  }

  private inferAction(method: string): string {
    switch (method) {
      case 'POST': return 'create';
      case 'PUT': return 'update';
      case 'PATCH': return 'update';
      case 'DELETE': return 'deactivate';
      default: return 'unknown';
    }
  }

  private inferModule(url: string): string {
    const parts = url.replace(/^\/v1\//, '').split('/');
    return parts[0] || 'unknown';
  }

  private extractNewValues(body: any): Record<string, unknown> | null {
    if (!body || typeof body !== 'object') return null;
    const { reason, _meta, ...values } = body;
    return Object.keys(values).length > 0 ? values : null;
  }
}
