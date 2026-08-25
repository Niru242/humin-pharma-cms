import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('holidays')
@Index('idx_holidays_date', ['date'])
@Index('idx_holidays_year', ['year'])
export class Holiday extends BaseEntity {
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: 'full', name: 'day_type' })
  dayType: string; // 'full', 'half', 'restricted'

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'plant_id' })
  plantId: string | null; // null = all plants

  @Column({ type: 'boolean', default: false })
  optional: boolean; // Restricted/optional holiday

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;
}
