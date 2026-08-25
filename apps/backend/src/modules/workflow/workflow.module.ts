import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowDefinition } from './entities/workflow-definition.entity';
import { WorkflowInstance } from './entities/workflow-instance.entity';
import { WorkflowTask } from './entities/workflow-task.entity';
import { Delegation } from './entities/delegation.entity';
import { WorkflowService } from './workflow.service';

/**
 * M01 — Generic Workflow/State Machine Engine (Section 7)
 *
 * Supports: sequential approvals, reject/return-with-comment,
 * reassignment, SLA-based escalation, delegation/out-of-office.
 *
 * Every domain state machine runs on top of this engine.
 * @Global() so any module can inject WorkflowService without importing.
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkflowDefinition,
      WorkflowInstance,
      WorkflowTask,
      Delegation,
    ]),
  ],
  controllers: [],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
