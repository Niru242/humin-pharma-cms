import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { seedRolesAndPermissions } from './seed-roles-permissions';
import { seedAdminUser } from './seed-admin-user';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'pharma_admin',
    password: process.env.DB_PASSWORD || 'pharma_secret_2024',
    database: process.env.DB_NAME || 'pharma_hrms',
    entities: [path.resolve(__dirname, '../../**/*.entity{.ts,.js}')],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('[Seed] Database connected');

  try {
    await seedRolesAndPermissions(dataSource);
    await seedAdminUser(dataSource);
    console.log('[Seed] All seeds completed successfully');
  } catch (error) {
    console.error('[Seed] Error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
