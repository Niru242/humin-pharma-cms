import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MigrationToolService } from './migration-tool.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('migration')
export class MigrationToolController {
  constructor(private readonly migrationService: MigrationToolService) {}

  /** POST /v1/migration/dry-run — Validate a CSV without importing. */
  @Post('dry-run')
  @RequirePermissions('system.import.manage')
  @UseInterceptors(FileInterceptor('file'))
  async dryRun(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: RequestUser,
  ) {
    const content = file.buffer.toString('utf-8');
    return this.migrationService.dryRun(content, file.originalname, user);
  }

  /** POST /v1/migration/resolve-exception — Approve/reject an exception. */
  @Post('resolve-exception')
  @RequirePermissions('system.import.manage')
  async resolveException(
    @Body() body: { exceptionIndex: number; action: 'approve' | 'reject' },
    @CurrentUser() user: RequestUser,
  ) {
    return this.migrationService.resolveException(body.exceptionIndex, body.action, user);
  }

  /** POST /v1/migration/resolve-department — Resolve a department alias. */
  @Post('resolve-department')
  @RequirePermissions('system.import.manage')
  async resolveDepartment(@Body() body: { rawDepartment: string }) {
    return this.migrationService.resolveDepartment(body.rawDepartment);
  }
}
