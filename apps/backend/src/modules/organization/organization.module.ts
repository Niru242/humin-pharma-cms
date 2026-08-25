import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Plant } from './entities/plant.entity';
import { Department } from './entities/department.entity';
import { Designation } from './entities/designation.entity';
import { Grade } from './entities/grade.entity';
import { Employee } from './entities/employee.entity';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Plant, Department, Designation, Grade, Employee]),
    AuthModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService, TypeOrmModule],
})
export class OrganizationModule {}
