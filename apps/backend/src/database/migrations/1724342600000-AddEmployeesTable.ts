import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmployeesTable1724342600000 implements MigrationInterface {
  name = 'AddEmployeesTable1724342600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`employees\` (
        \`id\` CHAR(36) NOT NULL,
        \`created_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        \`updated_at\` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
        \`version\` INT DEFAULT 1 NOT NULL,
        \`is_active\` TINYINT(1) DEFAULT 1 NOT NULL,
        \`deactivated_at\` DATETIME(6) NULL,
        \`created_by\` CHAR(36) NULL,
        \`updated_by\` CHAR(36) NULL,
        \`employee_code\` VARCHAR(50) NOT NULL,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(255) NULL,
        \`phone\` VARCHAR(20) NULL,
        \`avatar_url\` VARCHAR(500) NULL,
        \`designation\` VARCHAR(200) NULL,
        \`grade_id\` CHAR(36) NULL,
        \`company_id\` CHAR(36) NULL,
        \`plant_id\` CHAR(36) NULL,
        \`department_id\` CHAR(36) NULL,
        \`department_name\` VARCHAR(200) NULL,
        \`reporting_manager_id\` CHAR(36) NULL,
        \`reporting_manager_name\` VARCHAR(200) NULL,
        \`employment_status\` VARCHAR(20) DEFAULT 'Active' NOT NULL,
        \`employment_type\` VARCHAR(20) NULL,
        \`date_of_joining\` DATE NULL,
        \`date_of_birth\` DATE NULL,
        \`gender\` VARCHAR(10) NULL,
        \`confirmation_date\` DATE NULL,
        \`separation_date\` DATE NULL,
        \`pan_number\` VARCHAR(20) NULL,
        \`aadhaar_number\` VARCHAR(20) NULL,
        \`bank_account_number\` VARCHAR(50) NULL,
        \`bank_ifsc\` VARCHAR(20) NULL,
        \`bank_name\` VARCHAR(100) NULL,
        \`uan_number\` VARCHAR(30) NULL,
        \`esic_number\` VARCHAR(30) NULL,
        \`current_address\` TEXT NULL,
        \`permanent_address\` TEXT NULL,
        \`emergency_contact_name\` VARCHAR(200) NULL,
        \`emergency_contact_phone\` VARCHAR(20) NULL,
        \`user_id\` CHAR(36) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_employees_code\` (\`employee_code\`),
        INDEX \`idx_employees_company\` (\`company_id\`),
        INDEX \`idx_employees_plant\` (\`plant_id\`),
        INDEX \`idx_employees_department\` (\`department_id\`),
        INDEX \`idx_employees_manager\` (\`reporting_manager_id\`),
        INDEX \`idx_employees_status\` (\`employment_status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`employees\``);
  }
}
