import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { TimeAttendanceService } from './time-attendance.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('time')
export class TimeAttendanceController {
  constructor(private readonly timeService: TimeAttendanceService) {}

  // ============ SHIFTS ============
  @Get('shifts')
  @RequirePermissions('attendance.read')
  async listShifts() { return { items: await this.timeService.listShifts() }; }

  @Post('shifts')
  @RequirePermissions('attendance.import')
  async createShift(@Body() body: any) { return this.timeService.createShift(body); }

  @Put('shifts/:id')
  @RequirePermissions('attendance.import')
  async updateShift(@Param('id') id: string, @Body() body: any) { return this.timeService.updateShift(id, body); }

  // ============ RAW PUNCHES ============
  @Get('raw-punches')
  @RequirePermissions('attendance.read')
  async listRawPunches(
    @Query('employeeCode') employeeCode?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.timeService.listRawPunches({ employeeCode, dateFrom, dateTo, page: page ? parseInt(page, 10) : undefined, pageSize: pageSize ? parseInt(pageSize, 10) : undefined });
  }

  @Post('punch-import')
  @RequirePermissions('attendance.import')
  async importPunches(@Body() body: { punches: Array<{ employeeCode: string; punchTime: string; punchType?: string; deviceId?: string }> }, @CurrentUser() user: RequestUser) {
    return this.timeService.importPunches(body.punches, user);
  }

  // ============ DAILY ATTENDANCE ============
  @Get('attendance')
  @RequirePermissions('attendance.read')
  async listDailyAttendance(
    @Query('employeeId') employeeId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.timeService.listDailyAttendance({ employeeId, month: month ? parseInt(month, 10) : undefined, year: year ? parseInt(year, 10) : undefined, status, page: page ? parseInt(page, 10) : undefined, pageSize: pageSize ? parseInt(pageSize, 10) : undefined });
  }

  @Get('attendance/summary/:employeeId')
  @RequirePermissions('attendance.read')
  async getMonthlySummary(
    @Param('employeeId') employeeId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.timeService.getMonthlySummary(employeeId, parseInt(month, 10), parseInt(year, 10));
  }

  // ============ ROSTER ============
  @Get('roster/:employeeId')
  @RequirePermissions('attendance.read')
  async getRoster(@Param('employeeId') employeeId: string, @Query('month') month: string, @Query('year') year: string) {
    return { items: await this.timeService.getRoster(employeeId, parseInt(month, 10), parseInt(year, 10)) };
  }

  @Post('roster')
  @RequirePermissions('attendance.import')
  async assignRoster(@Body() body: { assignments: any[] }) { return this.timeService.assignRoster(body.assignments); }

  // ============ PERIODS ============
  @Get('periods')
  @RequirePermissions('attendance.read')
  async listPeriods(@Query('plantId') plantId?: string) { return { items: await this.timeService.listPeriods(plantId) }; }

  @Post('periods/lock')
  @RequirePermissions('attendance.lock')
  async lockPeriod(@Body() body: { plantId: string; month: number; year: number }, @CurrentUser() user: RequestUser) {
    return this.timeService.lockPeriod(body.plantId, body.month, body.year, user.id);
  }
}
