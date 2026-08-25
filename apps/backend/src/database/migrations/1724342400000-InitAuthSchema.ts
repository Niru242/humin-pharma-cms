import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial migration — Auth & RBAC foundation tables (MySQL).
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
 * UUIDs are stored as CHAR(36) with application-generated values.
 * JSON columns use MySQL's native JSON type.
 */
export class InitAuthSchema1724342400000 implements MigrationInterface {
  name = 'InitAuthSchema1724342400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- ROLES ---
    await queryRunner.query(`
      CREATE TABLE \`roles\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`updated_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
        \`version\` INT DEFAULT 1 NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`deactivated_at\` DATETIME(6) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`code\` VARCHAR(50) NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NULL,
        \`requires_mfa\` TINYINT(1) DEFAULT 0 NOT NULL,
        \`hierarchy_level\` INT DEFAULT 0 NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_roles_code\` (\`code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- PERMISSIONS ---
    await queryRunner.query(`
      CREATE TABLE \`permissions\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`updated_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
        \`version\` INT DEFAULT 1 NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`deactivated_at\` DATETIME(6) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`code\` VARCHAR(100) NOT NULL,
        \`domain\` VARCHAR(50) NOT NULL,
        \`action\` VARCHAR(50) NOT NULL,
        \`description\` VARCHAR(200) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_permissions_code\` (\`code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- USERS ---
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`updated_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
        \`version\` INT DEFAULT 1 NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`deactivated_at\` DATETIME(6) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NOT NULL,
        \`employee_code\` VARCHAR(50) NULL,
        \`mfa_enabled\` TINYINT(1) DEFAULT 0 NOT NULL,
        \`mfa_secret\` VARCHAR(255) NULL,
        \`failed_login_attempts\` INT DEFAULT 0 NOT NULL,
        \`locked_until\` DATETIME(6) NULL,
        \`last_login_at\` DATETIME(6) NULL,
        \`last_login_ip\` VARCHAR(45) NULL,
        \`token_version\` INT DEFAULT 1 NOT NULL,
        \`password_changed_at\` DATETIME(6) NULL,
        \`must_change_password\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`privacy_policy_version_accepted\` VARCHAR(50) NULL,
        \`privacy_policy_accepted_at\` DATETIME(6) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_users_email\` (\`email\`),
        INDEX \`idx_users_employee_code\` (\`employee_code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- ROLE_PERMISSIONS (junction) ---
    await queryRunner.query(`
      CREATE TABLE \`role_permissions\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`updated_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
        \`version\` INT DEFAULT 1 NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`deactivated_at\` DATETIME(6) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`role_id\` CHAR(36) NOT NULL,
        \`permission_id\` CHAR(36) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_role_permissions_unique\` (\`role_id\`, \`permission_id\`),
        CONSTRAINT \`fk_role_permissions_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_role_permissions_permission\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- USER_ROLES (junction) ---
    await queryRunner.query(`
      CREATE TABLE \`user_roles\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`updated_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
        \`version\` INT DEFAULT 1 NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`deactivated_at\` DATETIME(6) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`user_id\` CHAR(36) NOT NULL,
        \`role_id\` CHAR(36) NOT NULL,
        \`effective_from\` DATETIME(6) NULL,
        \`effective_to\` DATETIME(6) NULL,
        \`assigned_by\` CHAR(36) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_user_roles_unique\` (\`user_id\`, \`role_id\`),
        CONSTRAINT \`fk_user_roles_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_user_roles_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- USER_DATA_SCOPES ---
    await queryRunner.query(`
      CREATE TABLE \`user_data_scopes\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`updated_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
        \`version\` INT DEFAULT 1 NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`deactivated_at\` DATETIME(6) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`user_id\` CHAR(36) NOT NULL,
        \`scope_type\` ENUM('all', 'company', 'plant', 'department', 'self') NOT NULL,
        \`scope_entity_id\` CHAR(36) NULL,
        \`scope_entity_label\` VARCHAR(200) NULL,
        \`assigned_by\` CHAR(36) NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_user_data_scopes_user\` (\`user_id\`),
        CONSTRAINT \`fk_user_data_scopes_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- REFRESH_TOKENS ---
    await queryRunner.query(`
      CREATE TABLE \`refresh_tokens\` (
        \`id\` CHAR(36) NOT NULL,
        \`user_id\` CHAR(36) NOT NULL,
        \`token_hash\` VARCHAR(255) NOT NULL,
        \`family_id\` VARCHAR(100) NULL,
        \`issued_from_ip\` VARCHAR(45) NULL,
        \`user_agent\` VARCHAR(500) NULL,
        \`issued_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`expires_at\` DATETIME(6) NOT NULL,
        \`is_revoked\` TINYINT(1) DEFAULT 0 NOT NULL,
        \`revoked_at\` DATETIME(6) NULL,
        \`revoked_reason\` VARCHAR(100) NULL,
        \`replaced_by_id\` CHAR(36) NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_refresh_tokens_user\` (\`user_id\`),
        INDEX \`idx_refresh_tokens_hash\` (\`token_hash\`),
        CONSTRAINT \`fk_refresh_tokens_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- AUDIT_EVENTS (append-only, no UPDATE/DELETE enforced at app level) ---
    await queryRunner.query(`
      CREATE TABLE \`audit_events\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`actor_id\` CHAR(36) NULL,
        \`actor_email\` VARCHAR(255) NULL,
        \`actor_ip\` VARCHAR(45) NULL,
        \`action\` VARCHAR(50) NOT NULL,
        \`module\` VARCHAR(50) NOT NULL,
        \`entity_type\` VARCHAR(100) NOT NULL,
        \`entity_id\` CHAR(36) NULL,
        \`old_values\` JSON NULL,
        \`new_values\` JSON NULL,
        \`changed_fields\` JSON NULL,
        \`reason\` TEXT NULL,
        \`metadata\` JSON NULL,
        \`outcome\` VARCHAR(20) DEFAULT 'success' NOT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_audit_events_actor\` (\`actor_id\`),
        INDEX \`idx_audit_events_entity\` (\`entity_type\`, \`entity_id\`),
        INDEX \`idx_audit_events_action\` (\`action\`),
        INDEX \`idx_audit_events_timestamp\` (\`created_at\`),
        INDEX \`idx_audit_events_module\` (\`module\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // MySQL doesn't have RULES like PostgreSQL.
    // Audit immutability is enforced at application level via:
    // 1. TypeORM entity with no @UpdateDateColumn and no update/delete methods
    // 2. API layer that only exposes INSERT operations for audit_events
    // 3. DB user for production can be restricted with GRANT INSERT ONLY on audit_events
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse dependency order
    await queryRunner.query(`DROP TABLE IF EXISTS \`audit_events\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`refresh_tokens\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_data_scopes\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_roles\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`role_permissions\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`permissions\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`roles\`;`);
  }
}
