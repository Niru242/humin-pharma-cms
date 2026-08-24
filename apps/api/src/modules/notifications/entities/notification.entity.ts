import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('notifications')
@Index('idx_notifications_recipient', ['recipientId', 'isRead'])
@Index('idx_notifications_type', ['channel'])
export class Notification extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'recipient_id' })
  recipientId: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'recipient_email' })
  recipientEmail: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'recipient_phone' })
  recipientPhone: string | null;

  @Column({ type: 'varchar', length: 20, default: 'in_app' })
  channel: string; // 'in_app', 'email', 'sms', 'whatsapp'

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string | null; // 'workflow', 'leave', 'attendance', 'system'

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'entity_type' })
  entityType: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'entity_id' })
  entityId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'action_url' })
  actionUrl: string | null; // Deep link to the relevant page

  @Column({ type: 'tinyint', width: 1, default: false, name: 'is_read' })
  isRead: boolean;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'read_at' })
  readAt: Date | null;

  @Column({ type: 'varchar', length: 20, default: 'pending', name: 'delivery_status' })
  deliveryStatus: string; // 'pending', 'sent', 'delivered', 'failed'

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'sent_at' })
  sentAt: Date | null;

  @Column({ type: 'text', nullable: true, name: 'failure_reason' })
  failureReason: string | null;

  @Column({ type: 'varchar', length: 20, default: 'normal' })
  priority: string; // 'low', 'normal', 'high', 'urgent'

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'template_code' })
  templateCode: string | null; // Which template was used
}
