import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

/**
 * Leave Balance — ledger-based (credits, debits, adjustments tracked).
 * The balance is the sum of all transactions, not a single mutable field.
 */
@Entity('leave_balances')
@Index('idx_leave_bal_employee_type', ['employeeId', 'leaveTypeId', 'year'])
export class LeaveBalance extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'varchar', length: 36, name: 'leave_type_id' })
  leaveTypeId: string;

  @Column({ type: 'varchar', length: 50, name: 'leave_type_code' })
  leaveTypeCode: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  entitled: number; // Total entitlement for the year

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  accrued: number; // Accrued so far this year

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  used: number; // Consumed by approved leaves

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0, name: 'carry_forward' })
  carryForward: number; // Carried from previous year

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  adjustment: number; // Manual adjustments (+/-)

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  pending: number; // Currently pending approval

  // Computed: balance = entitled + carryForward + adjustment - used - pending
  get balance(): number {
    return Number(this.entitled) + Number(this.carryForward) + Number(this.adjustment) - Number(this.used) - Number(this.pending);
  }
}
