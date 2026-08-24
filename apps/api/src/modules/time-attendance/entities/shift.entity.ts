import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('shifts')
@Index('idx_shifts_code', ['code'], { unique: true })
export class Shift extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'time', name: 'start_time' })
  startTime: string; // e.g. '08:00:00'

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @Column({ type: 'int', default: 480, name: 'working_minutes' })
  workingMinutes: number; // Standard working minutes (e.g. 480 = 8 hours)

  @Column({ type: 'int', default: 30, name: 'break_minutes' })
  breakMinutes: number;

  @Column({ type: 'boolean', default: false, name: 'is_night_shift' })
  isNightShift: boolean;

  @Column({ type: 'int', default: 15, name: 'grace_in_minutes' })
  graceInMinutes: number;

  @Column({ type: 'int', default: 15, name: 'grace_out_minutes' })
  graceOutMinutes: number;

  @Column({ type: 'int', default: 30, name: 'half_day_minutes' })
  halfDayMinutes: number; // Minutes less than this = half day

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;
}
