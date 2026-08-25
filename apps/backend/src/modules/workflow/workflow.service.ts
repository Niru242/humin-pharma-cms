import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { WorkflowDefinition, WorkflowStep } from './entities/workflow-definition.entity';
import { WorkflowInstance } from './entities/workflow-instance.entity';
import { WorkflowTask } from './entities/workflow-task.entity';
import { Delegation } from './entities/delegation.entity';
import { AuditService } from '../audit/audit.service';

export interface StartWorkflowParams {
  definitionCode: string;
  entityType: string;
  entityId: string;
  requesterId: string;
  requesterName: string;
  assigneeId: string;
  assigneeName: string;
  title: string;
  priority?: string;
  metadata?: Record<string, unknown>;
}

export interface ActOnTaskParams {
  taskId: string;
  actorId: string;
  actorName: string;
  action: 'approve' | 'reject' | 'return' | 'reassign';
  comment?: string;
  reassignToId?: string;
  reassignToName?: string;
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowDefinition)
    private readonly defRepo: Repository<WorkflowDefinition>,
    @InjectRepository(WorkflowInstance)
    private readonly instanceRepo: Repository<WorkflowInstance>,
    @InjectRepository(WorkflowTask)
    private readonly taskRepo: Repository<WorkflowTask>,
    @InjectRepository(Delegation)
    private readonly delegationRepo: Repository<Delegation>,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Start a new workflow instance.
   * Creates the instance and the first task for the first step's assignee.
   */
  async startWorkflow(params: StartWorkflowParams): Promise<WorkflowInstance> {
    const definition = await this.defRepo.findOneBy({ code: params.definitionCode, isActive: true });
    if (!definition) {
      throw new NotFoundException(`Workflow definition '${params.definitionCode}' not found`);
    }

    if (!definition.steps || definition.steps.length === 0) {
      throw new BadRequestException('Workflow definition has no steps');
    }

    const firstStep = definition.steps[0];
    const slaDeadline = firstStep.slaHours
      ? new Date(Date.now() + firstStep.slaHours * 60 * 60 * 1000)
      : null;

    // Check delegation — if assignee has delegated, route to delegatee
    const effectiveAssignee = await this.resolveAssignee(params.assigneeId, params.assigneeName, params.definitionCode);

    const instance = this.instanceRepo.create({
      definitionId: definition.id,
      entityType: params.entityType,
      entityId: params.entityId,
      currentStatus: firstStep.name,
      requesterId: params.requesterId,
      requesterName: params.requesterName,
      currentAssigneeId: effectiveAssignee.id,
      currentAssigneeName: effectiveAssignee.name,
      currentStepIndex: 0,
      slaDeadline,
      metadata: params.metadata || null,
    });
    const savedInstance = await this.instanceRepo.save(instance);

    // Create the first task
    const task = this.taskRepo.create({
      instanceId: savedInstance.id,
      stepName: firstStep.name,
      assigneeId: effectiveAssignee.id,
      assigneeName: effectiveAssignee.name,
      status: 'pending',
      slaDeadline,
      entityType: params.entityType,
      entityId: params.entityId,
      title: params.title,
      priority: params.priority || 'normal',
      allowedActions: firstStep.actions,
      delegatedFromId: effectiveAssignee.delegatedFrom || null,
    });
    await this.taskRepo.save(task);

    return savedInstance;
  }

  /**
   * Act on a task — approve, reject, return, or reassign.
   * Advances the workflow to the next step or terminal state.
   */
  async actOnTask(params: ActOnTaskParams): Promise<WorkflowInstance> {
    const task = await this.taskRepo.findOne({
      where: { id: params.taskId, status: 'pending' },
      relations: ['instance'],
    });

    if (!task) {
      throw new NotFoundException('Task not found or already completed');
    }

    // Verify the actor is the assignee (or their delegatee)
    const canAct = await this.canUserActOnTask(params.actorId, task);
    if (!canAct) {
      throw new ForbiddenException('You are not authorized to act on this task');
    }

    // Verify the action is allowed
    if (task.allowedActions && !task.allowedActions.includes(params.action)) {
      throw new BadRequestException(`Action '${params.action}' is not allowed for this task`);
    }

    // No self-approval: requester cannot approve their own request
    const instance = task.instance;
    if (params.action === 'approve' && instance.requesterId === params.actorId) {
      throw new ForbiddenException('Self-approval is not permitted');
    }

    // Update the task
    task.status = this.mapActionToStatus(params.action);
    task.action = params.action;
    task.comment = params.comment || null;
    task.actedById = params.actorId;
    task.actedByName = params.actorName;
    task.actedAt = new Date();
    await this.taskRepo.save(task);

    // Get the workflow definition to determine next step
    const definition = await this.defRepo.findOneBy({ id: instance.definitionId });
    if (!definition) {
      throw new NotFoundException('Workflow definition not found');
    }

    const currentStep = definition.steps[instance.currentStepIndex];

    // Advance the workflow based on the action
    switch (params.action) {
      case 'approve':
        await this.handleApprove(instance, definition, currentStep, params);
        break;
      case 'reject':
        await this.handleReject(instance, currentStep);
        break;
      case 'return':
        await this.handleReturn(instance, currentStep);
        break;
      case 'reassign':
        await this.handleReassign(instance, task, params);
        break;
    }

    // Audit the action
    await this.auditService.log({
      actorId: params.actorId,
      actorEmail: params.actorName,
      action: `workflow_${params.action}`,
      module: 'workflow',
      entityType: instance.entityType,
      entityId: instance.entityId,
      newValues: { taskId: task.id, action: params.action, comment: params.comment },
      reason: params.comment,
      metadata: { workflowInstanceId: instance.id, stepName: task.stepName },
    });

    return this.instanceRepo.findOneOrFail({ where: { id: instance.id }, relations: ['tasks'] });
  }

  /**
   * Get tasks assigned to a user (My Task Inbox).
   */
  async getMyTasks(userId: string, filters?: { status?: string; priority?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize || 20));

    const qb = this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.instance', 'instance')
      .where('task.assignee_id = :userId', { userId })
      .andWhere('task.is_active = true');

    if (filters?.status) {
      qb.andWhere('task.status = :status', { status: filters.status });
    } else {
      qb.andWhere('task.status = :status', { status: 'pending' });
    }

    if (filters?.priority) {
      qb.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    qb.orderBy('task.sla_deadline', 'ASC', 'NULLS LAST')
      .addOrderBy('task.created_at', 'DESC');

    const [items, totalItems] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: items.map((task) => this.formatTaskForInbox(task)),
      pageInfo: { page, pageSize, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }

  /**
   * Get task counts for the inbox badge.
   */
  async getTaskCounts(userId: string) {
    const pending = await this.taskRepo.count({ where: { assigneeId: userId, status: 'pending', isActive: true } });
    const overdue = await this.taskRepo.count({ where: { assigneeId: userId, status: 'pending', isOverdue: true, isActive: true } });
    return { pending, overdue };
  }

  /**
   * Create a delegation (out-of-office).
   */
  async createDelegation(
    delegatorId: string,
    delegatorName: string,
    delegateeId: string,
    delegateeName: string,
    effectiveFrom: Date,
    effectiveTo: Date,
    reason?: string,
    workflowCodes?: string[],
  ): Promise<Delegation> {
    // Check no active delegation already exists
    const existing = await this.getActiveDelegation(delegatorId);
    if (existing) {
      throw new BadRequestException('An active delegation already exists. Revoke it first.');
    }

    // Prevent self-delegation
    if (delegatorId === delegateeId) {
      throw new BadRequestException('Cannot delegate to yourself');
    }

    const delegation = this.delegationRepo.create({
      delegatorId,
      delegatorName,
      delegateeId,
      delegateeName,
      effectiveFrom,
      effectiveTo,
      reason: reason || null,
      workflowCodes: workflowCodes || null,
    });
    const saved = await this.delegationRepo.save(delegation);

    await this.auditService.log({
      actorId: delegatorId,
      actorEmail: delegatorName,
      action: 'create_delegation',
      module: 'workflow',
      entityType: 'Delegation',
      entityId: saved.id,
      newValues: { delegateeId, delegateeName, effectiveFrom, effectiveTo, reason },
    });

    return saved;
  }

  /**
   * Revoke an active delegation.
   */
  async revokeDelegation(delegationId: string, revokedBy: string): Promise<Delegation> {
    const delegation = await this.delegationRepo.findOneBy({ id: delegationId, isRevoked: false });
    if (!delegation) {
      throw new NotFoundException('Active delegation not found');
    }

    delegation.isRevoked = true;
    delegation.revokedAt = new Date();
    delegation.revokedBy = revokedBy;
    const saved = await this.delegationRepo.save(delegation);

    await this.auditService.log({
      actorId: revokedBy,
      action: 'revoke_delegation',
      module: 'workflow',
      entityType: 'Delegation',
      entityId: delegationId,
      oldValues: { isRevoked: false },
      newValues: { isRevoked: true },
    });

    return saved;
  }

  /**
   * Get active delegation for a user.
   */
  async getActiveDelegation(userId: string): Promise<Delegation | null> {
    const now = new Date();
    return this.delegationRepo.createQueryBuilder('d')
      .where('d.delegator_id = :userId', { userId })
      .andWhere('d.is_active = true')
      .andWhere('d.is_revoked = false')
      .andWhere('d.effective_from <= :now', { now })
      .andWhere('d.effective_to >= :now', { now })
      .getOne();
  }

  /**
   * Get the allowedActions for a record based on its workflow state.
   * Section 7: "the frontend must decide which buttons/actions to show
   * based on a server-returned allowedActions list"
   */
  async getAllowedActions(entityType: string, entityId: string, userId: string): Promise<string[]> {
    const task = await this.taskRepo.findOne({
      where: { entityType, entityId, status: 'pending', isActive: true },
    });

    if (!task) return [];

    const canAct = await this.canUserActOnTask(userId, task);
    if (!canAct) return [];

    return task.allowedActions || [];
  }

  // --- Private helpers ---

  private async handleApprove(
    instance: WorkflowInstance,
    definition: WorkflowDefinition,
    currentStep: WorkflowStep,
    params: ActOnTaskParams,
  ): Promise<void> {
    const nextStepName = currentStep.onApprove;
    const nextStepIndex = definition.steps.findIndex((s) => s.name === nextStepName);

    if (nextStepIndex >= 0) {
      // Advance to next step
      const nextStep = definition.steps[nextStepIndex];
      const slaDeadline = nextStep.slaHours
        ? new Date(Date.now() + nextStep.slaHours * 60 * 60 * 1000)
        : null;

      instance.currentStatus = nextStep.name;
      instance.currentStepIndex = nextStepIndex;
      instance.slaDeadline = slaDeadline;
      // Assignee for next step would be determined by the domain module
      // For now, clear it — the domain module sets it when creating the next task
      instance.currentAssigneeId = null;
      instance.currentAssigneeName = null;
      await this.instanceRepo.save(instance);
    } else if (definition.terminalStatuses.includes(nextStepName || 'approved')) {
      // Terminal state
      instance.currentStatus = nextStepName || 'approved';
      instance.isCompleted = true;
      instance.completedAt = new Date();
      instance.currentAssigneeId = null;
      instance.currentAssigneeName = null;
      await this.instanceRepo.save(instance);
    } else {
      // Default: mark as approved (terminal)
      instance.currentStatus = 'approved';
      instance.isCompleted = true;
      instance.completedAt = new Date();
      instance.currentAssigneeId = null;
      await this.instanceRepo.save(instance);
    }
  }

  private async handleReject(instance: WorkflowInstance, currentStep: WorkflowStep): Promise<void> {
    instance.currentStatus = currentStep.onReject || 'rejected';
    instance.isCompleted = true;
    instance.completedAt = new Date();
    instance.currentAssigneeId = null;
    await this.instanceRepo.save(instance);
  }

  private async handleReturn(instance: WorkflowInstance, currentStep: WorkflowStep): Promise<void> {
    instance.currentStatus = currentStep.onReturn || 'returned';
    // Return goes back to requester — not completed, just reassigned back
    instance.currentAssigneeId = instance.requesterId;
    instance.currentAssigneeName = instance.requesterName;
    await this.instanceRepo.save(instance);
  }

  private async handleReassign(
    instance: WorkflowInstance,
    task: WorkflowTask,
    params: ActOnTaskParams,
  ): Promise<void> {
    if (!params.reassignToId) {
      throw new BadRequestException('reassignToId is required for reassign action');
    }

    // Create a new task for the reassigned person
    const newTask = this.taskRepo.create({
      instanceId: instance.id,
      stepName: task.stepName,
      assigneeId: params.reassignToId,
      assigneeName: params.reassignToName || null,
      status: 'pending',
      slaDeadline: task.slaDeadline,
      entityType: task.entityType,
      entityId: task.entityId,
      title: task.title,
      priority: task.priority,
      allowedActions: task.allowedActions,
    });
    await this.taskRepo.save(newTask);

    // Update instance assignee
    instance.currentAssigneeId = params.reassignToId;
    instance.currentAssigneeName = params.reassignToName || null;
    await this.instanceRepo.save(instance);
  }

  private async resolveAssignee(
    assigneeId: string,
    assigneeName: string,
    workflowCode: string,
  ): Promise<{ id: string; name: string; delegatedFrom: string | null }> {
    const delegation = await this.getActiveDelegation(assigneeId);

    if (delegation) {
      // Check if delegation covers this workflow type
      const coversThis = !delegation.workflowCodes || delegation.workflowCodes.includes(workflowCode);
      if (coversThis) {
        return {
          id: delegation.delegateeId,
          name: delegation.delegateeName || assigneeName,
          delegatedFrom: assigneeId,
        };
      }
    }

    return { id: assigneeId, name: assigneeName, delegatedFrom: null };
  }

  private async canUserActOnTask(userId: string, task: WorkflowTask): Promise<boolean> {
    if (task.assigneeId === userId) return true;

    // Check if the user is a delegatee for the assignee
    const delegation = await this.getActiveDelegation(task.assigneeId);
    if (delegation && delegation.delegateeId === userId) return true;

    return false;
  }

  private mapActionToStatus(action: string): string {
    switch (action) {
      case 'approve': return 'completed';
      case 'reject': return 'rejected';
      case 'return': return 'returned';
      case 'reassign': return 'reassigned';
      default: return 'completed';
    }
  }

  private formatTaskForInbox(task: WorkflowTask) {
    return {
      id: task.id,
      title: task.title,
      stepName: task.stepName,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      assigneeName: task.assigneeName,
      entityType: task.entityType,
      entityId: task.entityId,
      allowedActions: task.allowedActions,
      slaDeadline: task.slaDeadline,
      isOverdue: task.isOverdue,
      delegatedFromId: task.delegatedFromId,
      createdAt: task.createdAt,
      instance: task.instance ? {
        id: task.instance.id,
        currentStatus: task.instance.currentStatus,
        requesterName: task.instance.requesterName,
      } : null,
    };
  }
}
