import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

/**
 * Document entity — tracks uploaded files with checksum and versioning.
 *
 * Section 1: "S3-compatible object storage with checksum + version + retention metadata"
 * Section 8: "File uploads: validate extension, real MIME type, size, checksum,
 *             and run malware scanning before accepting."
 */
@Entity('documents')
@Index('idx_documents_entity', ['entityType', 'entityId'])
@Index('idx_documents_category', ['category'])
@Index('idx_documents_uploaded_by', ['uploadedById'])
export class Document extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'original_name' })
  originalName: string; // Original filename as uploaded

  @Column({ type: 'varchar', length: 255, name: 'stored_name' })
  storedName: string; // UUID-based name in storage (prevents collisions/traversal)

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mimeType: string; // Real MIME type (validated server-side, not client-reported)

  @Column({ type: 'varchar', length: 20 })
  extension: string; // File extension (validated against allowlist)

  @Column({ type: 'bigint', name: 'file_size' })
  fileSize: number; // Size in bytes

  @Column({ type: 'varchar', length: 64 })
  checksum: string; // SHA-256 checksum for integrity verification

  @Column({ type: 'varchar', length: 500, name: 'storage_path' })
  storagePath: string; // Full path in S3/MinIO bucket

  @Column({ type: 'varchar', length: 100, name: 'storage_bucket' })
  storageBucket: string;

  // --- Versioning ---
  @Column({ type: 'int', default: 1, name: 'document_version' })
  documentVersion: number;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'parent_document_id' })
  parentDocumentId: string | null; // Points to previous version

  @Column({ type: 'boolean', default: true, name: 'is_latest' })
  isLatest: boolean;

  // --- Ownership / Association ---
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'entity_type' })
  entityType: string | null; // 'Employee', 'LeaveRequest', 'TrainingCourse', etc.

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'entity_id' })
  entityId: string | null; // Associated record UUID

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string | null; // 'identity', 'qualification', 'contract', 'medical', 'policy', etc.

  @Column({ type: 'varchar', length: 36, name: 'uploaded_by_id' })
  uploadedById: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'uploaded_by_name' })
  uploadedByName: string | null;

  // --- Retention (Section 5) ---
  @Column({ type: 'varchar', length: 20, default: 'internal', name: 'sensitivity_tier' })
  sensitivityTier: string; // 'public', 'internal', 'restricted', 'confidential'

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'retention_class' })
  retentionClass: string | null; // 'permanent', '7_years', '3_years', 'until_separation'

  @Column({ type: 'boolean', default: false, name: 'legal_hold' })
  legalHold: boolean; // Overrides retention — cannot be deleted

  @Column({ type: 'timestamptz', nullable: true, name: 'retention_expires_at' })
  retentionExpiresAt: Date | null;

  // --- Metadata ---
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'json', nullable: true })
  tags: string[] | null;
}
