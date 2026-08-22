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
 * Section 4, R15 (Auditor/Read-only): "No create/update/delete, ever."
 * This controller ONLY has GET endpoints.
 *
 * Access: Requires 'audit.log.view' permission.
 * Roles that have it: super_admin, hr_admin, qa_compliance, auditor, it_support
 *
 * Features:
 * - Paginated list with filters (date range, actor, module, action, entity, outcome)
 * - Full-text search across actor email, entity type, action, reason
 * - Record history timeline (all events for a specific entity)
 * - Filter dropdown values (distinct actions, modules)
 */
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * GET /v1/audit/events — Paginated audit log with filters.
   *
   * Query params:
   *   page, pageSize, actorId, actorEmail, action, module,
   *   entityType, entityId, outcome, dateFrom, dateTo, search
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
   *
   * Shows all audit events for a specific record, ordered by most recent first.
   * Useful for reviewing the full change history of an employee, leave request, etc.
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
   * GET /v1/audit/filters/actions — Get distinct action types for filter UI.
   */
  @Get('filters/actions')
  @RequirePermissions('audit.log.view')
  async getFilterActions() {
    const actions = await this.auditService.getDistinctActions();
    return { actions };
  }

  /**
   * GET /v1/audit/filters/modules — Get distinct modules for filter UI.
   */
  @Get('filters/modules')
  @RequirePermissions('audit.log.view')
  async getFilterModules() {
    const modules = await this.auditService.getDistinctModules();
    return { modules };
  }

  /**
   * GET /v1/audit/summary — High-level stats for the audit dashboard.
   */
  @Get('summary')
  @RequirePermissions('audit.log.view')
  async getSummary(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    // Query counts by action type and outcome for the given period
    const qb = this.auditService['auditRepo'].createQueryBuilder('audit');

    if (dateFrom) {
      qb.andWhere('audit.created_at >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      qb.andWhere('audit.created_at <= :dateTo', { dateTo });
    }

    const totalEvents = await qb.getCount();

    const byAction = await qb
      .clone()
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.action')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const byModule = await qb
      .clone()
      .select('audit.module', 'module')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.module')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const byOutcome = await qb
      .clone()
      .select('audit.outcome', 'outcome')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.outcome')
      .getRawMany();

    return {
      totalEvents,
      byAction,
      byModule,
      byOutcome,
    };
  }
}
