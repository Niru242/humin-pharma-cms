import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  VersionColumn,
} from 'typeorm';

/**
 * Base entity — every table inherits from this.
 * Provides: UUID primary key, timestamps, optimistic concurrency version, soft delete.
 *
 * Section 3 rules:
 * - Every business mutation is versioned (optimistic concurrency)
 * - Soft delete only for anything transactional or referenced
 * - All timestamps stored in UTC
 *
 * MySQL: Uses CHAR(36) for UUIDs, DATETIME(6) for timestamps.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'datetime', precision: 6, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6, name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn({ name: 'version' })
  version: number;

  @Column({ type: 'tinyint', width: 1, default: 1, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'deactivated_at' })
  deactivatedAt: Date | null;

  @Column({ type: 'char', length: 36, nullable: true, name: 'created_by' })
  createdBy: string | null;

  @Column({ type: 'char', length: 36, nullable: true, name: 'updated_by' })
  updatedBy: string | null;
}
