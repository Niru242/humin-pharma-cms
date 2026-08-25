import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * Raw Punch — immutable biometric event (Section 3: "Raw source data is immutable.
 * Biometric punches, once imported, are never edited or deleted.")
 */
@Entity('raw_punches')
@Index('idx_raw_punches_employee_time', ['employeeCode', 'punchTime'])
@Index('idx_raw_punches_import', ['importJobId'])
export class RawPunch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'datetime', precision: 6, name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 50, name: 'employee_code' })
  employeeCode: string;

  @Column({ type: 'datetime', precision: 6, name: 'punch_time' })
  punchTime: Date;

  @Column({ type: 'varchar', length: 10, name: 'punch_type' })
  punchType: string; // 'IN', 'OUT', 'UNKNOWN'

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'device_id' })
  deviceId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'device_location' })
  deviceLocation: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'import_job_id' })
  importJobId: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'source_type' })
  sourceType: string | null; // 'biometric', 'manual', 'api', 'mobile'

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'raw_data_hash' })
  rawDataHash: string | null; // For dedup

  // No update/delete — this is an immutable log
}
