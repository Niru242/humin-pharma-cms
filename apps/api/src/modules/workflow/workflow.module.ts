import { Module } from '@nestjs/common';

/**
 * M01 — Generic Workflow/State Machine Engine (Section 7)
 *
 * Supports: sequential approvals, reject/return-with-comment,
 * reassignment, SLA-based escalation, delegation/out-of-office.
 *
 * Every domain state machine runs on top of this engine.
 * Will be fully implemented in Stage 1, Substep 6.
 */
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class WorkflowModule {}
