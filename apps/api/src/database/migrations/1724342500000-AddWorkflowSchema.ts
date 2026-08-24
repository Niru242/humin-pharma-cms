import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Workflow engine tables.
 * - workflow_definitions
 * - workflow_instances
 * - workflow_tasks
 * - delegations
 */
export class AddWorkflowSchema1724342500000 implements MigrationInterface {
  name = 'AddWorkflowSchema1724342500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- WORKFLOW_DEFINITIONS ---
    await queryRunner.query(`
      CREATE TABLE "workflow_definitions" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "code" VARCHAR(100) NOT NULL,
        "name" VARCHAR(200) NOT NULL,
        "description" TEXT,
        "module" VARCHAR(50) NOT NULL,
        "steps" JSONB NOT NULL,
        "initial_status" VARCHAR(50) DEFAULT 'draft' NOT NULL,
        "terminal_statuses" JSONB NOT NULL,
        CONSTRAINT "pk_workflow_definitions" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_workflow_def_code" ON "workflow_definitions" ("code");`);

    // --- WORKFLOW_INSTANCES ---
    await queryRunner.query(`
      CREATE TABLE "workflow_instances" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "definition_id" UUID NOT NULL,
        "entity_type" VARCHAR(100) NOT NULL,
        "entity_id" UUID NOT NULL,
        "current_status" VARCHAR(50) NOT NULL,
        "requester_id" UUID NOT NULL,
        "requester_name" VARCHAR(255),
        "current_assignee_id" UUID,
        "current_assignee_name" VARCHAR(255),
        "current_step_index" INTEGER DEFAULT 0 NOT NULL,
        "sla_deadline" TIMESTAMPTZ,
        "is_escalated" BOOLEAN DEFAULT false NOT NULL,
        "is_completed" BOOLEAN DEFAULT false NOT NULL,
        "completed_at" TIMESTAMPTZ,
        "metadata" JSONB,
        CONSTRAINT "pk_workflow_instances" PRIMARY KEY ("id"),
        CONSTRAINT "fk_workflow_instances_def" FOREIGN KEY ("definition_id") REFERENCES "workflow_definitions"("id")
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_workflow_inst_entity" ON "workflow_instances" ("entity_type", "entity_id");`);
    await queryRunner.query(`CREATE INDEX "idx_workflow_inst_status" ON "workflow_instances" ("current_status");`);
    await queryRunner.query(`CREATE INDEX "idx_workflow_inst_requester" ON "workflow_instances" ("requester_id");`);

    // --- WORKFLOW_TASKS ---
    await queryRunner.query(`
      CREATE TABLE "workflow_tasks" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "instance_id" UUID NOT NULL,
        "step_name" VARCHAR(50) NOT NULL,
        "assignee_id" UUID NOT NULL,
        "assignee_name" VARCHAR(255),
        "status" VARCHAR(20) DEFAULT 'pending' NOT NULL,
        "action" VARCHAR(20),
        "comment" TEXT,
        "acted_by_id" UUID,
        "acted_by_name" VARCHAR(255),
        "acted_at" TIMESTAMPTZ,
        "sla_deadline" TIMESTAMPTZ,
        "is_overdue" BOOLEAN DEFAULT false NOT NULL,
        "reassigned_to_id" UUID,
        "delegated_from_id" UUID,
        "entity_type" VARCHAR(100) NOT NULL,
        "entity_id" UUID NOT NULL,
        "title" VARCHAR(200),
        "priority" VARCHAR(20),
        "allowed_actions" JSONB,
        CONSTRAINT "pk_workflow_tasks" PRIMARY KEY ("id"),
        CONSTRAINT "fk_workflow_tasks_instance" FOREIGN KEY ("instance_id") REFERENCES "workflow_instances"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_workflow_task_assignee" ON "workflow_tasks" ("assignee_id", "status");`);
    await queryRunner.query(`CREATE INDEX "idx_workflow_task_instance" ON "workflow_tasks" ("instance_id");`);
    await queryRunner.query(`CREATE INDEX "idx_workflow_task_deadline" ON "workflow_tasks" ("sla_deadline");`);

    // --- DELEGATIONS ---
    await queryRunner.query(`
      CREATE TABLE "delegations" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "delegator_id" UUID NOT NULL,
        "delegator_name" VARCHAR(255),
        "delegatee_id" UUID NOT NULL,
        "delegatee_name" VARCHAR(255),
        "effective_from" TIMESTAMPTZ NOT NULL,
        "effective_to" TIMESTAMPTZ NOT NULL,
        "reason" TEXT,
        "workflow_codes" JSONB,
        "is_revoked" BOOLEAN DEFAULT false NOT NULL,
        "revoked_at" TIMESTAMPTZ,
        "revoked_by" UUID,
        CONSTRAINT "pk_delegations" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_delegations_delegator" ON "delegations" ("delegator_id");`);
    await queryRunner.query(`CREATE INDEX "idx_delegations_delegatee" ON "delegations" ("delegatee_id");`);
    await queryRunner.query(`CREATE INDEX "idx_delegations_active" ON "delegations" ("delegator_id", "is_active", "effective_from", "effective_to");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "delegations";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workflow_tasks";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workflow_instances";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workflow_definitions";`);
  }
}
