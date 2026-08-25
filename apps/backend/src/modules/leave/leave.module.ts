import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from '../workflow/workflow.module';
import { LeaveType } from './entities/leave-type.entity';
import { LeavePolicy } from './entities/leave-policy.entity';
import { LeaveBalance } from './entities/leave-balance.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { Holiday } from './entities/holiday.entity';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';

@Module({
  imports: [
    WorkflowModule,
    TypeOrmModule.forFeature([LeaveType, LeavePolicy, LeaveBalance, LeaveRequest, Holiday]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService, TypeOrmModule],
})
export class LeaveModule {}
