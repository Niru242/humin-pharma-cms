import {
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { AuditService, AuditQueryParams } from './audit.service';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

/**
 * Audit Log Viewer — read-only access to the audit trail.
 *
 * Access: Requires 'audit.log.view' permission.
 * Roles that have it: super_admin, hr_admin, qa_compliance, auditor, it_support
 */
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * GET /v1/audit/events — Paginated audit log with filters.
   */
  @Get('events')
  @RequirePermissions('audit.log.view')
  async listEvents(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('actorId') actorId?: string,
    @Query('actorEmail') actorEmail?: string,
    @Query('action') action?: string,
    @Query('module') module?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('outcome') outcome?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('search') search?: string,
  ) {
    const params: AuditQueryParams = {
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      actorId,
      actorEmail,
      action,
      module,
      entityType,
      entityId,
      outcome,
      dateFrom,
      dateTo,
      search,
    };
    return this.auditService.query(params);
  }

  /**
   * GET /v1/audit/events/:entityType/:entityId — Record history timeline.
   */
  @Get('events/:entityType/:entityId')
  @RequirePermissions('audit.log.view')
  async getEntityHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    const events = await this.auditService.getEntityHistory(entityType, entityId);
    return { items: events, totalItems: events.length };
  }

  /**
   * GET /v1/audit/filters/actions — Distinct action types for filter dropdown.
   */
  @Get('filters/actions')
  @RequirePermissions('audit.log.view')
  async getFilterActions() {
    const actions = await this.auditService.getDistinctActions();
    return { actions };
  }

  /**
   * GET /v1/audit/filters/modules — Distinct modules for filter dropdown.
   */
  @Get('filters/modules')
  @RequirePermissions('audit.log.view')
  async getFilterModules() {
    const modules = await this.auditService.getDistinctModules();
    return { modules };
  }
}
