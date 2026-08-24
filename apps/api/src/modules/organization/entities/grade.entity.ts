import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('grades')
@Index('idx_grades_code', ['code'], { unique: true })
export class Grade extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'Grade', name: 'master_type' })
  masterType: string;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @Column({ type: 'int', default: 90, name: 'probation_days' })
  probationDays: number;

  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status: string;
}
