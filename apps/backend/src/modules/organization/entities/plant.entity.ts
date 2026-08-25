import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Company } from './company.entity';
import { Department } from './department.entity';

@Entity('plants')
@Index('idx_plants_code', ['code'], { unique: true })
export class Plant extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 36, name: 'company_id' })
  companyId: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timezone: string | null; // e.g. 'Asia/Kolkata'

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @ManyToOne(() => Company, (c) => c.plants)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Department, (d) => d.plant)
  departments: Department[];
}
