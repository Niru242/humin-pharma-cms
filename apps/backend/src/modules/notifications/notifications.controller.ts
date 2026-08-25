import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** GET /v1/notifications — My notifications (paginated). */
  @Get()
  async getMyNotifications(
    @CurrentUser() user: RequestUser,
    @Query('isRead') isRead?: string,
    @Query('channel') channel?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.notificationsService.getForUser(user.id, {
      isRead: isRead !== undefined ? isRead === 'true' : undefined,
      channel,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  /** GET /v1/notifications/unread-count — Badge count. */
  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: RequestUser) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  /** POST /v1/notifications/:id/read — Mark as read. */
  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.notificationsService.markAsRead(id, user.id);
    return { message: 'Marked as read' };
  }

  /** POST /v1/notifications/read-all — Mark all as read. */
  @Post('read-all')
  async markAllAsRead(@CurrentUser() user: RequestUser) {
    await this.notificationsService.markAllAsRead(user.id);
    return { message: 'All marked as read' };
  }

  /** POST /v1/notifications/send — Send notification (admin/system use). */
  @Post('send')
  async send(@Body() body: any, @CurrentUser() user: RequestUser) {
    return this.notificationsService.send(body);
  }
}
