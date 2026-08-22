import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial migration — Auth & RBAC foundation tables.
 *
 * Tables created:
 * - users
 * - roles
 * - permissions
 * - role_permissions (junction)
 * - user_roles (junction)
 * - user_data_scopes
 * - refresh_tokens
 * - audit_events
 *
 * All UUIDs use gen_random_uuid() (Postgres native, no extension needed on PG 13+).
 */
export class InitAuthSchema1724342400000 implements MigrationInterface {
  name = 'InitAuthSchema1724342400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- ENUM TYPES ---
    await queryRunner.query(`
      CREATE TYPE "scope_type_enum" AS ENUM ('all', 'company', 'plant', 'department', 'self');
    `);

    // --- ROLES ---
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "code" VARCHAR(50) NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "description" TEXT,
        "requires_mfa" BOOLEAN DEFAULT false NOT NULL,
        "hierarchy_level" INTEGER DEFAULT 0 NOT NULL,
        CONSTRAINT "pk_roles" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_roles_code" ON "roles" ("code");`);

    // --- PERMISSIONS ---
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "code" VARCHAR(100) NOT NULL,
        "domain" VARCHAR(50) NOT NULL,
        "action" VARCHAR(50) NOT NULL,
        "description" VARCHAR(200),
        CONSTRAINT "pk_permissions" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_permissions_code" ON "permissions" ("code");`);

    // --- USERS ---
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "email" VARCHAR(255) NOT NULL,
        "password_hash" VARCHAR(255) NOT NULL,
        "first_name" VARCHAR(100) NOT NULL,
        "last_name" VARCHAR(100) NOT NULL,
        "employee_code" VARCHAR(50),
        "mfa_enabled" BOOLEAN DEFAULT false NOT NULL,
        "mfa_secret" VARCHAR(255),
        "failed_login_attempts" INTEGER DEFAULT 0 NOT NULL,
        "locked_until" TIMESTAMPTZ,
        "last_login_at" TIMESTAMPTZ,
        "last_login_ip" VARCHAR(45),
        "token_version" INTEGER DEFAULT 1 NOT NULL,
        "password_changed_at" TIMESTAMPTZ,
        "must_change_password" BOOLEAN DEFAULT true NOT NULL,
        "privacy_policy_version_accepted" VARCHAR(50),
        "privacy_policy_accepted_at" TIMESTAMPTZ,
        CONSTRAINT "pk_users" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email");`);
    await queryRunner.query(`CREATE INDEX "idx_users_employee_code" ON "users" ("employee_code");`);

    // --- ROLE_PERMISSIONS (junction) ---
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "role_id" UUID NOT NULL,
        "permission_id" UUID NOT NULL,
        CONSTRAINT "pk_role_permissions" PRIMARY KEY ("id"),
        CONSTRAINT "fk_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_role_permissions_unique" ON "role_permissions" ("role_id", "permission_id");`);

    // --- USER_ROLES (junction) ---
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "user_id" UUID NOT NULL,
        "role_id" UUID NOT NULL,
        "effective_from" TIMESTAMPTZ,
        "effective_to" TIMESTAMPTZ,
        "assigned_by" UUID,
        CONSTRAINT "pk_user_roles" PRIMARY KEY ("id"),
        CONSTRAINT "fk_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_user_roles_unique" ON "user_roles" ("user_id", "role_id");`);

    // --- USER_DATA_SCOPES ---
    await queryRunner.query(`
      CREATE TABLE "user_data_scopes" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "version" INTEGER DEFAULT 1 NOT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "deactivated_at" TIMESTAMPTZ,
        "created_by" UUID,
        "updated_by" UUID,
        "user_id" UUID NOT NULL,
        "scope_type" "scope_type_enum" NOT NULL,
        "scope_entity_id" UUID,
        "scope_entity_label" VARCHAR(200),
        "assigned_by" UUID,
        CONSTRAINT "pk_user_data_scopes" PRIMARY KEY ("id"),
        CONSTRAINT "fk_user_data_scopes_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_user_data_scopes_user" ON "user_data_scopes" ("user_id");`);

    // --- REFRESH_TOKENS ---
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "user_id" UUID NOT NULL,
        "token_hash" VARCHAR(255) NOT NULL,
        "family_id" VARCHAR(100),
        "issued_from_ip" VARCHAR(45),
        "user_agent" VARCHAR(500),
        "issued_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "is_revoked" BOOLEAN DEFAULT false NOT NULL,
        "revoked_at" TIMESTAMPTZ,
        "revoked_reason" VARCHAR(100),
        "replaced_by_id" UUID,
        CONSTRAINT "pk_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "fk_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens" ("user_id");`);
    await queryRunner.query(`CREATE INDEX "idx_refresh_tokens_hash" ON "refresh_tokens" ("token_hash");`);

    // --- AUDIT_EVENTS (append-only, no UPDATE/DELETE) ---
    await queryRunner.query(`
      CREATE TABLE "audit_events" (
        "id" UUID DEFAULT gen_random_uuid() NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
        "actor_id" UUID,
        "actor_email" VARCHAR(255),
        "actor_ip" VARCHAR(45),
        "action" VARCHAR(50) NOT NULL,
        "module" VARCHAR(50) NOT NULL,
        "entity_type" VARCHAR(100) NOT NULL,
        "entity_id" UUID,
        "old_values" JSONB,
        "new_values" JSONB,
        "changed_fields" JSONB,
        "reason" TEXT,
        "metadata" JSONB,
        "outcome" VARCHAR(20) DEFAULT 'success' NOT NULL,
        CONSTRAINT "pk_audit_events" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_audit_events_actor" ON "audit_events" ("actor_id");`);
    await queryRunner.query(`CREATE INDEX "idx_audit_events_entity" ON "audit_events" ("entity_type", "entity_id");`);
    await queryRunner.query(`CREATE INDEX "idx_audit_events_action" ON "audit_events" ("action");`);
    await queryRunner.query(`CREATE INDEX "idx_audit_events_timestamp" ON "audit_events" ("created_at");`);
    await queryRunner.query(`CREATE INDEX "idx_audit_events_module" ON "audit_events" ("module");`);

    // --- PROTECT AUDIT TABLE: Revoke UPDATE/DELETE at DB level ---
    // This is an additional safety net — even if app code tries, Postgres will reject.
    // Note: This assumes the app connects with the same user that owns the table.
    // In production, use a separate read/append-only role for audit writes.
    await queryRunner.query(`
      CREATE RULE "audit_events_no_update" AS ON UPDATE TO "audit_events" DO INSTEAD NOTHING;
    `);
    await queryRunner.query(`
      CREATE RULE "audit_events_no_delete" AS ON DELETE TO "audit_events" DO INSTEAD NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop rules first
    await queryRunner.query(`DROP RULE IF EXISTS "audit_events_no_delete" ON "audit_events";`);
    await queryRunner.query(`DROP RULE IF EXISTS "audit_events_no_update" ON "audit_events";`);

    // Drop tables in reverse dependency order
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_events";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_data_scopes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles";`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "scope_type_enum";`);
  }
}
