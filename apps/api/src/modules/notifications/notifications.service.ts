import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { DocumentsService } from '../documents/documents.service';

export interface SendNotificationParams {
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp';
  title: string;
  body: string;
  category?: string;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  priority?: string;
  templateCode?: string;
}

export interface SendFromTemplateParams {
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp';
  templateCode: string;
  variables: Record<string, string>;
  category?: string;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  priority?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    private readonly documentsService: DocumentsService,
  ) {}

  /** Send a notification (in-app + optionally email/sms/whatsapp). */
  async send(params: SendNotificationParams): Promise<Notification> {
    const notif = this.notifRepo.create({
      recipientId: params.recipientId,
      recipientEmail: params.recipientEmail || null,
      recipientPhone: params.recipientPhone || null,
      channel: params.channel,
      title: params.title,
      body: params.body,
      category: params.category || null,
      entityType: params.entityType || null,
      entityId: params.entityId || null,
      actionUrl: params.actionUrl || null,
      priority: params.priority || 'normal',
      templateCode: params.templateCode || null,
      deliveryStatus: params.channel === 'in_app' ? 'delivered' : 'pending',
      sentAt: params.channel === 'in_app' ? new Date() : null,
    });
    const saved = await this.notifRepo.save(notif);

    // For external channels, queue delivery (placeholder for BullMQ integration)
    if (params.channel !== 'in_app') {
      await this.dispatchExternal(saved);
    }

    return saved;
  }

  /** Send notification using a template with variable interpolation. */
  async sendFromTemplate(params: SendFromTemplateParams): Promise<Notification> {
    const rendered = await this.documentsService.renderTemplate(params.templateCode, params.variables);
    return this.send({
      recipientId: params.recipientId,
      recipientEmail: params.recipientEmail,
      recipientPhone: params.recipientPhone,
      channel: params.channel,
      title: rendered.subject,
      body: rendered.body,
      category: params.category,
      entityType: params.entityType,
      entityId: params.entityId,
      actionUrl: params.actionUrl,
      priority: params.priority,
      templateCode: params.templateCode,
    });
  }

  /** Get notifications for a user (inbox). */
  async getForUser(userId: string, filters?: { isRead?: boolean; channel?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize || 20));

    const qb = this.notifRepo.createQueryBuilder('n')
      .where('n.recipient_id = :userId', { userId })
      .andWhere('n.is_active = true');

    if (filters?.isRead !== undefined) {
      qb.andWhere('n.is_read = :isRead', { isRead: filters.isRead });
    }
    if (filters?.channel) {
      qb.andWhere('n.channel = :channel', { channel: filters.channel });
    }

    qb.orderBy('n.created_at', 'DESC');
    const [items, totalItems] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items,
      pageInfo: { page, pageSize, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }

  /** Get unread count for badge. */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notifRepo.count({ where: { recipientId: userId, isRead: false, isActive: true, channel: 'in_app' } });
  }

  /** Mark notification as read. */
  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notifRepo.update({ id, recipientId: userId }, { isRead: true, readAt: new Date() });
  }

  /** Mark all as read for a user. */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notifRepo.update({ recipientId: userId, isRead: false }, { isRead: true, readAt: new Date() });
  }

  /** Dispatch external notification (email/sms/whatsapp) — placeholder for queue. */
  private async dispatchExternal(notification: Notification): Promise<void> {
    // TODO: Push to BullMQ queue for async delivery
    // For now, mark as sent (simulated)
    try {
      switch (notification.channel) {
        case 'email':
          // await this.emailTransport.send(notification.recipientEmail, notification.title, notification.body);
          break;
        case 'sms':
          // await this.smsGateway.send(notification.recipientPhone, notification.body);
          break;
        case 'whatsapp':
          // await this.whatsappApi.send(notification.recipientPhone, notification.body);
          break;
      }
      await this.notifRepo.update(notification.id, { deliveryStatus: 'sent', sentAt: new Date() });
    } catch (error: any) {
      await this.notifRepo.update(notification.id, { deliveryStatus: 'failed', failureReason: error?.message || 'Unknown error' });
    }
  }
}
