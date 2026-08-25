import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/auth/entities/user.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { UserRole } from '../../modules/auth/entities/user-role.entity';
import { UserDataScope } from '../../modules/auth/entities/user-data-scope.entity';

/**
 * Seed one test Super Admin user so you can log in immediately.
 *
 * Credentials (DEV ONLY — change in production):
 *   email:    admin@pharmahrms.local
 *   password: Admin@12345
 *
 * The admin gets:
 * - super_admin role
 * - 'all' data scope
 * - MFA disabled by default (enable via first-login flow later)
 */

const ADMIN_EMAIL = 'admin@pharmahrms.local';
const ADMIN_PASSWORD = 'Admin@12345';

export async function seedAdminUser(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);
  const userRoleRepo = dataSource.getRepository(UserRole);
  const scopeRepo = dataSource.getRepository(UserDataScope);

  console.log('[Seed] Seeding admin user...');

  const existing = await userRepo.findOneBy({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`[Seed] Admin user already exists (${ADMIN_EMAIL}), skipping`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = userRepo.create({
    email: ADMIN_EMAIL,
    passwordHash,
    firstName: 'System',
    lastName: 'Administrator',
    employeeCode: 'ADMIN001',
    mfaEnabled: false, // Enable later via first-login MFA setup
    mustChangePassword: false, // Set true in production
    passwordChangedAt: new Date(),
    isActive: true,
  });
  const savedAdmin = await userRepo.save(admin);

  // Assign super_admin role
  const superAdminRole = await roleRepo.findOneBy({ code: 'super_admin' });
  if (superAdminRole) {
    const userRole = userRoleRepo.create({
      userId: savedAdmin.id,
      roleId: superAdminRole.id,
    });
    await userRoleRepo.save(userRole);
  }

  // Assign 'all' data scope
  const scope = scopeRepo.create({
    userId: savedAdmin.id,
    scopeType: 'all',
    scopeEntityLabel: 'All Plants (Full Access)',
  });
  await scopeRepo.save(scope);

  console.log('[Seed] Admin user created:');
  console.log(`         email:    ${ADMIN_EMAIL}`);
  console.log(`         password: ${ADMIN_PASSWORD}`);
  console.log('         role:     super_admin | scope: all');
  console.log('[Seed] >>> CHANGE THIS PASSWORD BEFORE ANY REAL DEPLOYMENT <<<');
}
