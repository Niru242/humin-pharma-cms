import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { Roster } from './entities/roster.entity';
import { RawPunch } from './entities/raw-punch.entity';
import { DailyAttendance } from './entities/daily-attendance.entity';
import { AttendancePeriod } from './entities/attendance-period.entity';
import { TimeAttendanceService } from './time-attendance.service';
import { TimeAttendanceController } from './time-attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Roster, RawPunch, DailyAttendance, AttendancePeriod])],
  controllers: [TimeAttendanceController],
  providers: [TimeAttendanceService],
  exports: [TimeAttendanceService, TypeOrmModule],
})
export class TimeAttendanceModule {}
