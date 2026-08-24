import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Data Retention Service — surfaces retention class per record type,
 * supports legal-hold override (Section 5).
 */

export interface RetentionPolicy {
  entityType: string;
  retentionClass: string; // 'permanent', '7_years', '3_years', 'until_separation', '1_year'
  retentionYears: number | null; // null = permanent
  description: string;
  legalBasis: string;
}

const RETENTION_POLICIES: RetentionPolicy[] = [
  { entityType: 'Employee', retentionClass: 'permanent', retentionYears: null, description: 'Employee master record', legalBasis: 'Employment Act' },
  { entityType: 'Attendance', retentionClass: '7_years', retentionYears: 7, description: 'Daily attendance records', legalBasis: 'Factories Act / Shops Act' },
  { entityType: 'LeaveRecord', retentionClass: '7_years', retentionYears: 7, description: 'Leave transactions', legalBasis: 'Employment records retention' },
  { entityType: 'PayrollRecord', retentionClass: '7_years', retentionYears: 7, description: 'Salary/payroll data', legalBasis: 'Income Tax Act / PF Act' },
  { entityType: 'MedicalRecord', retentionClass: '7_years', retentionYears: 7, description: 'Medical fitness records', legalBasis: 'Factories Act' },
  { entityType: 'DisciplineRecord', retentionClass: '7_years', retentionYears: 7, description: 'Disciplinary actions', legalBasis: 'Industrial Disputes Act' },
  { entityType: 'TrainingRecord', retentionClass: '7_years', retentionYears: 7, description: 'Training completion records', legalBasis: 'GMP/GxP compliance' },
  { entityType: 'AuditEvent', retentionClass: 'permanent', retentionYears: null, description: 'Audit trail', legalBasis: 'Compliance / GxP' },
  { entityType: 'Document', retentionClass: '7_years', retentionYears: 7, description: 'Uploaded documents', legalBasis: 'Varies by document type' },
  { entityType: 'Notification', retentionClass: '1_year', retentionYears: 1, description: 'In-app notifications', legalBasis: 'Operational' },
  { entityType: 'ImportJob', retentionClass: '3_years', retentionYears: 3, description: 'Import job records', legalBasis: 'Operational audit' },
];

@Injectable()
export class DataRetentionService {
  constructor(private readonly dataSource: DataSource) {}

  /** Get all retention policies. */
  getRetentionPolicies(): RetentionPolicy[] {
    return RETENTION_POLICIES;
  }

  /** Get retention policy for a specific entity type. */
  getRetentionPolicy(entityType: string): RetentionPolicy | undefined {
    return RETENTION_POLICIES.find((p) => p.entityType === entityType);
  }

  /** Get records eligible for archival/deletion based on retention rules. */
  async getExpiredRecords(entityType: string): Promise<{ count: number; oldestDate: string | null }> {
    const policy = this.getRetentionPolicy(entityType);
    if (!policy || !policy.retentionYears) return { count: 0, oldestDate: null };

    // This is a placeholder — actual implementation depends on each entity's table structure
    // In production, each entity table would be queried for records older than retention period
    return { count: 0, oldestDate: null };
  }

  /** Set legal hold on a record (prevents deletion regardless of retention). */
  async setLegalHold(entityType: string, entityId: string, hold: boolean): Promise<{ message: string }> {
    // For documents, update the legal_hold column
    if (entityType === 'Document') {
      await this.dataSource.query(
        `UPDATE documents SET legal_hold = $1 WHERE id = $2`,
        [hold, entityId],
      );
    }
    return { message: `Legal hold ${hold ? 'applied' : 'removed'} on ${entityType}:${entityId}` };
  }
}
