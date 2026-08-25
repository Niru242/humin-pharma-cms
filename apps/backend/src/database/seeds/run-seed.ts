import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { seedRolesAndPermissions } from './seed-roles-permissions';
import { seedAdminUser } from './seed-admin-user';
import { seedWorkflowDefinitions } from './seed-workflow-definitions';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function runSeed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'pharma_hrms',
    entities: [path.resolve(__dirname, '../../**/*.entity{.ts,.js}')],
    synchronize: false,
    charset: 'utf8mb4',
  });

  await dataSource.initialize();
  console.log('[Seed] Database connected');

  try {
    await seedRolesAndPermissions(dataSource);
    await seedAdminUser(dataSource);
    await seedWorkflowDefinitions(dataSource);
    console.log('[Seed] All seeds completed successfully');
  } catch (error) {
    console.error('[Seed] Error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
