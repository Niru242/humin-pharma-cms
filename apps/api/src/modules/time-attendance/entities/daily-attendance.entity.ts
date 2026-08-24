import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('daily_attendance')
@Index('idx_daily_att_employee_date', ['employeeId', 'date'], { unique: true })
@Index('idx_daily_att_status', ['status'])
@Index('idx_daily_att_period', ['periodMonth', 'periodYear'])
export class DailyAttendance extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'varchar', length: 50, name: 'employee_code' })
  employeeCode: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'shift_id' })
  shiftId: string | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'first_in' })
  firstIn: Date | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_out' })
  lastOut: Date | null;

  @Column({ type: 'int', default: 0, name: 'total_working_minutes' })
  totalWorkingMinutes: number;

  @Column({ type: 'int', default: 0, name: 'overtime_minutes' })
  overtimeMinutes: number;

  @Column({ type: 'int', default: 0, name: 'late_minutes' })
  lateMinutes: number;

  @Column({ type: 'int', default: 0, name: 'early_out_minutes' })
  earlyOutMinutes: number;

  @Column({ type: 'varchar', length: 20, default: 'present' })
  status: string; // 'present', 'absent', 'half_day', 'weekly_off', 'holiday', 'leave', 'on_duty'

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'day_type' })
  dayType: string | null; // 'working', 'weekly_off', 'holiday'

  @Column({ type: 'int', default: 0, name: 'punch_count' })
  punchCount: number;

  @Column({ type: 'boolean', default: false, name: 'is_regularized' })
  isRegularized: boolean;

  @Column({ type: 'boolean', default: false, name: 'has_exception' })
  hasException: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'exception_reason' })
  exceptionReason: string | null;

  @Column({ type: 'int', name: 'period_month' })
  periodMonth: number; // 1-12

  @Column({ type: 'int', name: 'period_year' })
  periodYear: number;

  @Column({ type: 'boolean', default: false, name: 'is_locked' })
  isLocked: boolean;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'plant_id' })
  plantId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'department_id' })
  departmentId: string | null;
}
