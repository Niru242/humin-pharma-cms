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
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn({ name: 'version' })
  version: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'deactivated_at' })
  deactivatedAt: Date | null;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updatedBy: string | null;
}
