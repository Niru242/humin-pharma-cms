import { Controller, Get, Post, Put, Delete, Param, Query, Body, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @RequirePermissions('document.upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  async upload(
    @UploadedFile() file: any,
    @CurrentUser() user: RequestUser,
    @Body('entityType') entityType?: string,
    @Body('entityId') entityId?: string,
    @Body('category') category?: string,
    @Body('description') description?: string,
    @Body('sensitivityTier') sensitivityTier?: string,
  ) {
    if (!file) return { error: 'No file provided' };
    return this.documentsService.upload(
      { originalName: file.originalname, mimeType: file.mimetype, size: file.size, buffer: file.buffer },
      user, { entityType, entityId, category, description, sensitivityTier },
    );
  }

  @Post(':id/version')
  @RequirePermissions('document.upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  async uploadVersion(@Param('id') id: string, @UploadedFile() file: any, @CurrentUser() user: RequestUser) {
    if (!file) return { error: 'No file provided' };
    return this.documentsService.uploadVersion(id, { originalName: file.originalname, mimeType: file.mimetype, size: file.size, buffer: file.buffer }, user);
  }

  @Get('entity/:entityType/:entityId')
  @RequirePermissions('document.read')
  async getByEntity(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    const items = await this.documentsService.getByEntity(entityType, entityId);
    return { items };
  }

  @Get('templates/list')
  @RequirePermissions('document.manage_templates')
  async listTemplates(@Query('templateType') templateType?: string, @Query('module') module?: string, @Query('status') status?: string) {
    const items = await this.documentsService.listTemplates({ templateType, module, status });
    return { items };
  }

  @Post('templates')
  @RequirePermissions('document.manage_templates')
  async createTemplate(@Body() body: any, @CurrentUser() user: RequestUser) {
    return this.documentsService.createTemplate(body, user);
  }

  @Put('templates/:id')
  @RequirePermissions('document.manage_templates')
  async updateTemplate(@Param('id') id: string, @Body() body: any, @CurrentUser() user: RequestUser) {
    return this.documentsService.updateTemplate(id, body, user);
  }

  @Post('templates/:id/publish')
  @RequirePermissions('document.manage_templates')
  async publishTemplate(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.documentsService.publishTemplate(id, user);
  }

  @Post('templates/render')
  @RequirePermissions('document.read')
  async renderTemplate(@Body() body: { code: string; variables: Record<string, string> }) {
    return this.documentsService.renderTemplate(body.code, body.variables);
  }

  @Get(':id')
  @RequirePermissions('document.read')
  async getById(@Param('id') id: string) { return this.documentsService.getById(id); }

  @Get(':id/download')
  @RequirePermissions('document.read')
  async download(@Param('id') id: string, @CurrentUser() user: RequestUser, @Res() res: Response) {
    const { buffer, document } = await this.documentsService.download(id, user);
    res.set({ 'Content-Type': document.mimeType, 'Content-Disposition': `attachment; filename="${document.originalName}"`, 'Content-Length': String(buffer.length) });
    res.send(buffer);
  }

  @Delete(':id')
  @RequirePermissions('document.upload')
  async softDelete(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body('reason') reason: string) {
    await this.documentsService.softDelete(id, user, reason);
    return { message: 'Document deactivated' };
  }
}
