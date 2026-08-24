import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ImportJobsService } from './import-jobs.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('import-jobs')
export class ImportJobsController {
  constructor(private readonly importJobsService: ImportJobsService) {}

  /** GET /v1/import-jobs — List all jobs. */
  @Get()
  @RequirePermissions('system.import.manage')
  async list(
    @Query('jobType') jobType?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @CurrentUser() user?: RequestUser,
  ) {
    return this.importJobsService.list({ jobType, status, page: page ? parseInt(page, 10) : undefined, pageSize: pageSize ? parseInt(pageSize, 10) : undefined }, user);
  }

  /** GET /v1/import-jobs/:id — Job details + progress. */
  @Get(':id')
  @RequirePermissions('system.import.manage')
  async getById(@Param('id') id: string) {
    return this.importJobsService.getById(id);
  }

  /** POST /v1/import-jobs/:id/cancel — Cancel a job. */
  @Post(':id/cancel')
  @RequirePermissions('system.import.manage')
  async cancel(@Param('id') id: string) {
    return this.importJobsService.cancel(id);
  }

  /** POST /v1/import-jobs/:id/retry — Retry a failed job. */
  @Post(':id/retry')
  @RequirePermissions('system.import.manage')
  async retry(@Param('id') id: string) {
    return this.importJobsService.retry(id);
  }
}
