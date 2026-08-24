import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('attendance_periods')
@Index('idx_att_periods_plant_month', ['plantId', 'month', 'year'], { unique: true })
export class AttendancePeriod extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'plant_id' })
  plantId: string;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: string; // 'open', 'ready_to_lock', 'locked', 'unlock_pending'

  @Column({ type: 'timestamptz', nullable: true, name: 'locked_at' })
  lockedAt: Date | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'locked_by' })
  lockedBy: string | null;
}
