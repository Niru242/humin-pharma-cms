import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

/**
 * Leave Policy — effective-dated, versioned (Section 3: never overwrite published).
 * Defines entitlements per leave type for a scope (company/plant/grade).
 */
@Entity('leave_policies')
@Index('idx_leave_policies_code', ['code'])
export class LeavePolicy extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'leave_type_id' })
  leaveTypeId: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'leave_type_code' })
  leaveTypeCode: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0, name: 'annual_entitlement' })
  annualEntitlement: number; // Days per year

  @Column({ type: 'varchar', length: 20, default: 'yearly', name: 'accrual_frequency' })
  accrualFrequency: string; // 'yearly', 'monthly', 'quarterly'

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'accrual_amount' })
  accrualAmount: number; // Amount per accrual cycle

  // --- Applicability scope ---
  @Column({ type: 'varchar', length: 36, nullable: true, name: 'company_id' })
  companyId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'plant_id' })
  plantId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'grade_id' })
  gradeId: string | null;

  // --- Versioning (Section 7: Draft → Published → Retired) ---
  @Column({ type: 'int', default: 1, name: 'policy_version' })
  policyVersion: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string; // 'draft', 'published', 'retired'

  @Column({ type: 'date', nullable: true, name: 'effective_from' })
  effectiveFrom: string | null;

  @Column({ type: 'date', nullable: true, name: 'effective_to' })
  effectiveTo: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'published_by' })
  publishedBy: string | null;

  @Column({ type: 'datetime', nullable: true, name: 'published_at' })
  publishedAt: Date | null;
}
