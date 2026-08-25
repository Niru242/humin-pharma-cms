import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Plant } from './plant.entity';

@Entity('departments')
@Index('idx_departments_code', ['code'], { unique: true })
@Index('idx_departments_plant', ['plantId'])
export class Department extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 36, name: 'plant_id' })
  plantId: string;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'head_employee_id' })
  headEmployeeId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'head_name' })
  headName: string | null;

  @Column({ type: 'int', default: 0 })
  headcount: number;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'parent_department_id' })
  parentDepartmentId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'cost_center' })
  costCenter: string | null;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @ManyToOne(() => Plant, (p) => p.departments)
  @JoinColumn({ name: 'plant_id' })
  plant: Plant;
}
