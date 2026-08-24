import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { DataRetentionService } from './data-retention.service';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('data-retention')
export class DataRetentionController {
  constructor(private readonly retentionService: DataRetentionService) {}

  /** GET /v1/data-retention/policies — List all retention policies. */
  @Get('policies')
  @RequirePermissions('system.data_retention')
  async getPolicies() {
    return { items: this.retentionService.getRetentionPolicies() };
  }

  /** GET /v1/data-retention/expired/:entityType — Check expired records. */
  @Get('expired/:entityType')
  @RequirePermissions('system.data_retention')
  async getExpired(@Param('entityType') entityType: string) {
    return this.retentionService.getExpiredRecords(entityType);
  }

  /** POST /v1/data-retention/legal-hold — Set/remove legal hold. */
  @Post('legal-hold')
  @RequirePermissions('system.data_retention')
  async setLegalHold(@Body() body: { entityType: string; entityId: string; hold: boolean }) {
    return this.retentionService.setLegalHold(body.entityType, body.entityId, body.hold);
  }
}
