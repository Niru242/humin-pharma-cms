import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

/**
 * Workflow Controller — Task Inbox + Delegation + Workflow admin.
 *
 * Section 7 + Section 10 Stage 1 item 6.
 */
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  // ============ MY TASK INBOX ============

  /**
   * GET /v1/workflow/tasks — My pending tasks (inbox).
   */
  @Get('tasks')
  async getMyTasks(
    @CurrentUser() user: RequestUser,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.workflowService.getMyTasks(user.id, {
      status,
      priority,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  /**
   * GET /v1/workflow/tasks/count — Badge count for the inbox.
   */
  @Get('tasks/count')
  async getTaskCounts(@CurrentUser() user: RequestUser) {
    return this.workflowService.getTaskCounts(user.id);
  }

  /**
   * POST /v1/workflow/tasks/:id/act — Act on a task (approve/reject/return/reassign).
   */
  @Post('tasks/:id/act')
  async actOnTask(
    @Param('id') taskId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: { action: 'approve' | 'reject' | 'return' | 'reassign'; comment?: string; reassignToId?: string; reassignToName?: string },
  ) {
    return this.workflowService.actOnTask({
      taskId,
      actorId: user.id,
      actorName: user.email,
      action: body.action,
      comment: body.comment,
      reassignToId: body.reassignToId,
      reassignToName: body.reassignToName,
    });
  }

  /**
   * GET /v1/workflow/actions/:entityType/:entityId — Get allowed actions for a record.
   * Section 7: "the frontend must decide which buttons to show based on
   * a server-returned allowedActions list"
   */
  @Get('actions/:entityType/:entityId')
  async getAllowedActions(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @CurrentUser() user: RequestUser,
  ) {
    const actions = await this.workflowService.getAllowedActions(entityType, entityId, user.id);
    return { allowedActions: actions };
  }

  // ============ DELEGATION / OUT-OF-OFFICE ============

  /**
   * GET /v1/workflow/delegation — Get my current active delegation.
   */
  @Get('delegation')
  async getMyDelegation(@CurrentUser() user: RequestUser) {
    const delegation = await this.workflowService.getActiveDelegation(user.id);
    return { delegation };
  }

  /**
   * POST /v1/workflow/delegation — Create a delegation (out-of-office).
   */
  @Post('delegation')
  async createDelegation(
    @CurrentUser() user: RequestUser,
    @Body() body: {
      delegateeId: string;
      delegateeName: string;
      effectiveFrom: string;
      effectiveTo: string;
      reason?: string;
      workflowCodes?: string[];
    },
  ) {
    return this.workflowService.createDelegation(
      user.id,
      user.email,
      body.delegateeId,
      body.delegateeName,
      new Date(body.effectiveFrom),
      new Date(body.effectiveTo),
      body.reason,
      body.workflowCodes,
    );
  }

  /**
   * DELETE /v1/workflow/delegation/:id — Revoke a delegation.
   */
  @Delete('delegation/:id')
  async revokeDelegation(
    @Param('id') delegationId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workflowService.revokeDelegation(delegationId, user.id);
  }

  // ============ WORKFLOW ADMIN ============

  /**
   * GET /v1/workflow/definitions — List all workflow definitions (admin).
   */
  @Get('definitions')
  @RequirePermissions('workflow.define')
  async listDefinitions() {
    // Workflow definitions are managed via seed/migration, not CRUD for now
    const defs = await this.workflowService['defRepo'].find({ where: { isActive: true } });
    return { items: defs };
  }
}
