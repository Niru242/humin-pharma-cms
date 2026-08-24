import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('rosters')
@Index('idx_rosters_employee_date', ['employeeId', 'date'], { unique: true })
export class Roster extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 36, name: 'shift_id' })
  shiftId: string;

  @Column({ type: 'varchar', length: 20, default: 'working', name: 'day_type' })
  dayType: string; // 'working', 'weekly_off', 'holiday', 'compensatory_off'

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'plant_id' })
  plantId: string | null;
}
