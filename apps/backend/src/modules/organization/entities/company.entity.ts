import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Plant } from './plant.entity';

@Entity('companies')
@Index('idx_companies_code', ['code'], { unique: true })
export class Company extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'legal_name' })
  legalName: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'registration_number' })
  registrationNumber: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'tax_id' })
  taxId: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'pin_code' })
  pinCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @OneToMany(() => Plant, (p) => p.company)
  plants: Plant[];
}
