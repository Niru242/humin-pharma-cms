import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('leave_types')
@Index('idx_leave_types_code', ['code'], { unique: true })
export class LeaveType extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string; // CL, EL, SL, ML, PL, CO, LWP

  @Column({ type: 'varchar', length: 100 })
  name: string; // Casual Leave, Earned Leave, etc.

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  paid: boolean;

  @Column({ type: 'boolean', default: false, name: 'carry_forward' })
  carryForward: boolean;

  @Column({ type: 'int', default: 0, name: 'max_carry_forward_days' })
  maxCarryForwardDays: number;

  @Column({ type: 'boolean', default: false, name: 'encashable' })
  encashable: boolean;

  @Column({ type: 'boolean', default: false, name: 'requires_document' })
  requiresDocument: boolean; // e.g., medical certificate for SL > 2 days

  @Column({ type: 'int', default: 0, name: 'min_days_advance_notice' })
  minDaysAdvanceNotice: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0.5, name: 'min_duration' })
  minDuration: number; // 0.5 = half day allowed

  @Column({ type: 'int', nullable: true, name: 'max_consecutive_days' })
  maxConsecutiveDays: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string | null; // null = all, 'M', 'F' (for maternity/paternity)

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;
}
