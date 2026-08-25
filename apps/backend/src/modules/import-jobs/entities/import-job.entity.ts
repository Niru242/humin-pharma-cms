import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('import_jobs')
@Index('idx_import_jobs_status', ['status'])
@Index('idx_import_jobs_type', ['jobType'])
@Index('idx_import_jobs_user', ['initiatedById'])
export class ImportJob extends BaseEntity {
  @Column({ type: 'varchar', length: 50, name: 'job_type' })
  jobType: string; // 'biometric_import', 'employee_migration', 'attendance_upload', 'recalculation', 'export'

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // 'pending', 'processing', 'completed', 'partially_completed', 'failed', 'cancelled'

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'file_name' })
  fileName: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'file_checksum' })
  fileChecksum: string | null; // For idempotency check

  @Column({ type: 'varchar', length: 36, name: 'initiated_by_id' })
  initiatedById: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'initiated_by_name' })
  initiatedByName: string | null;

  @Column({ type: 'int', default: 0, name: 'total_rows' })
  totalRows: number;

  @Column({ type: 'int', default: 0, name: 'processed_rows' })
  processedRows: number;

  @Column({ type: 'int', default: 0, name: 'success_rows' })
  successRows: number;

  @Column({ type: 'int', default: 0, name: 'error_rows' })
  errorRows: number;

  @Column({ type: 'int', default: 0, name: 'skipped_rows' })
  skippedRows: number;

  @Column({ type: 'int', default: 0, name: 'progress_percent' })
  progressPercent: number;

  @Column({ type: 'json', nullable: true })
  errors: Array<{ row: number; field?: string; message: string }> | null;

  @Column({ type: 'json', nullable: true })
  summary: Record<string, unknown> | null;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'started_at' })
  startedAt: Date | null;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'completed_at' })
  completedAt: Date | null;

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'result_file_path' })
  resultFilePath: string | null; // Path to downloadable error report
}
