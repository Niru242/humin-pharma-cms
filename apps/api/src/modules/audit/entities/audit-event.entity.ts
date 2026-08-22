import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

/**
 * Audit event entity — APPEND-ONLY, IMMUTABLE (Section 3, 6).
 *
 * Rules:
 * - No UPDATE or DELETE ever allowed on this table
 * - Logs: actor, record, old value, new value, reason, timestamp
 * - Independently searchable/reviewable
 * - Covers every mutation AND access to Confidential-tier records
 *
 * This table has NO version column, no soft delete — it's a pure log.
 */
@Entity('audit_events')
@Index('idx_audit_events_actor', ['actorId'])
@Index('idx_audit_events_entity', ['entityType', 'entityId'])
@Index('idx_audit_events_action', ['action'])
@Index('idx_audit_events_timestamp', ['createdAt'])
@Index('idx_audit_events_module', ['module'])
export class AuditEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  // --- Who ---
  @Column({ type: 'uuid', nullable: true, name: 'actor_id' })
  actorId: string | null; // null for system-generated events

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'actor_email' })
  actorEmail: string | null; // Denormalized for searchability without joins

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'actor_ip' })
  actorIp: string | null;

  // --- What ---
  @Column({ type: 'varchar', length: 50 })
  action: string; // 'create', 'update', 'deactivate', 'login', 'access_confidential', etc.

  @Column({ type: 'varchar', length: 50 })
  module: string; // 'auth', 'employee', 'attendance', 'leave', etc.

  @Column({ type: 'varchar', length: 100, name: 'entity_type' })
  entityType: string; // 'User', 'Employee', 'LeaveRequest', etc.

  @Column({ type: 'uuid', nullable: true, name: 'entity_id' })
  entityId: string | null;

  // --- Change details ---
  @Column({ type: 'jsonb', nullable: true, name: 'old_values' })
  oldValues: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true, name: 'new_values' })
  newValues: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true, name: 'changed_fields' })
  changedFields: string[] | null; // List of field names that changed

  // --- Context ---
  @Column({ type: 'text', nullable: true })
  reason: string | null; // Mandatory for high-risk actions (Section 8)

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null; // Extra context (e.g. workflow step, import batch ID)

  // --- Result ---
  @Column({ type: 'varchar', length: 20, default: 'success' })
  outcome: string; // 'success', 'failure', 'denied'
}
