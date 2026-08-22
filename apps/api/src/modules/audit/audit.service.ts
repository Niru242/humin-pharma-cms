import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEvent } from './entities/audit-event.entity';

export interface AuditLogParams {
  actorId?: string | null;
  actorEmail?: string | null;
  actorIp?: string | null;
  action: string;
  module: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  changedFields?: string[] | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
  outcome?: 'success' | 'failure' | 'denied';
}

export interface AuditQueryParams {
  page?: number;
  pageSize?: number;
  actorId?: string;
  actorEmail?: string;
  action?: string;
  module?: string;
  entityType?: string;
  entityId?: string;
  outcome?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEvent)
    private readonly auditRepo: Repository<AuditEvent>,
  ) {}

  async log(params: AuditLogParams): Promise<void> {
    try {
      await this.auditRepo.insert({
        actorId: params.actorId || null,
        actorEmail: params.actorEmail || null,
        actorIp: params.actorIp || null,
        action: params.action,
        module: params.module,
        entityType: params.entityType,
        entityId: params.entityId || null,
        oldValues: params.oldValues || null,
        newValues: params.newValues || null,
        changedFields: params.changedFields || null,
        reason: params.reason || null,
        metadata: params.metadata || null,
        outcome: params.outcome || 'success',
      });
    } catch (error) {
      console.error('[AUDIT] Failed to write audit event:', error);
    }
  }

  async logSync(params: AuditLogParams): Promise<AuditEvent> {
    const event = this.auditRepo.create({
      actorId: params.actorId || null,
      actorEmail: params.actorEmail || null,
      actorIp: params.actorIp || null,
      action: params.action,
      module: params.module,
      entityType: params.entityType,
      entityId: params.entityId || null,
      oldValues: params.oldValues || null,
      newValues: params.newValues || null,
      changedFields: params.changedFields || null,
      reason: params.reason || null,
      metadata: params.metadata || null,
      outcome: params.outcome || 'success',
    });
    return this.auditRepo.save(event);
  }

  async logBatch(events: AuditLogParams[]): Promise<void> {
    try {
      const entities = events.map((params) => ({
        actorId: params.actorId || null,
        actorEmail: params.actorEmail || null,
        actorIp: params.actorIp || null,
        action: params.action,
        module: params.module,
        entityType: params.entityType,
        entityId: params.entityId || null,
        oldValues: params.oldValues || null,
        newValues: params.newValues || null,
        changedFields: params.changedFields || null,
        reason: params.reason || null,
        metadata: params.metadata || null,
        outcome: params.outcome || 'success',
      }));
      await this.auditRepo.insert(entities);
    } catch (error) {
      console.error('[AUDIT] Failed to write batch audit events:', error);
    }
  }

  computeChangedFields(
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null,
  ): string[] {
    if (!oldValues || !newValues) return [];
    const changed: string[] = [];
    const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);
    for (const key of allKeys) {
      if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
        changed.push(key);
      }
    }
    return changed;
  }

  sanitizeValues(values: Record<string, unknown> | null): Record<string, unknown> | null {
    if (!values) return null;
    const SENSITIVE_KEYS = [
      'password', 'passwordHash', 'password_hash',
      'mfaSecret', 'mfa_secret', 'tokenHash', 'token_hash',
      'refreshToken', 'accessToken', 'encryptionKey',
    ];
    const sanitized = { ...values };
    for (const key of SENSITIVE_KEYS) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  async query(params: AuditQueryParams) {
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const qb = this.auditRepo.createQueryBuilder('audit');

    if (params.actorId) {
      qb.andWhere('audit.actor_id = :actorId', { actorId: params.actorId });
    }
    if (params.actorEmail) {
      qb.andWhere('audit.actor_email ILIKE :actorEmail', { actorEmail: `%${params.actorEmail}%` });
    }
    if (params.action) {
      qb.andWhere('audit.action = :action', { action: params.action });
    }
    if (params.module) {
      qb.andWhere('audit.module = :module', { module: params.module });
    }
    if (params.entityType) {
      qb.andWhere('audit.entity_type = :entityType', { entityType: params.entityType });
    }
    if (params.entityId) {
      qb.andWhere('audit.entity_id = :entityId', { entityId: params.entityId });
    }
    if (params.outcome) {
      qb.andWhere('audit.outcome = :outcome', { outcome: params.outcome });
    }
    if (params.dateFrom) {
      qb.andWhere('audit.created_at >= :dateFrom', { dateFrom: params.dateFrom });
    }
    if (params.dateTo) {
      qb.andWhere('audit.created_at <= :dateTo', { dateTo: params.dateTo });
    }
    if (params.search) {
      qb.andWhere(
        '(audit.actor_email ILIKE :search OR audit.entity_type ILIKE :search OR audit.action ILIKE :search OR audit.reason ILIKE :search)',
        { search: `%${params.search}%` },
      );
    }

    qb.orderBy('audit.created_at', 'DESC');
    const [items, totalItems] = await qb.skip(skip).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items,
      pageInfo: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getDistinctActions(): Promise<string[]> {
    const result = await this.auditRepo
      .createQueryBuilder('audit')
      .select('DISTINCT audit.action', 'action')
      .orderBy('audit.action', 'ASC')
      .getRawMany();
    return result.map((r: any) => r.action);
  }

  async getDistinctModules(): Promise<string[]> {
    const result = await this.auditRepo
      .createQueryBuilder('audit')
      .select('DISTINCT audit.module', 'module')
      .orderBy('audit.module', 'ASC')
      .getRawMany();
    return result.map((r: any) => r.module);
  }

  async getEntityHistory(entityType: string, entityId: string) {
    return this.auditRepo.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
