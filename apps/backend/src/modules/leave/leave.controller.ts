import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // --- Leave Types ---
  @Get('types')
  @RequirePermissions('leave.balance.view')
  async listTypes() { return { items: await this.leaveService.listLeaveTypes() }; }

  @Post('types')
  @RequirePermissions('leave.policy.manage')
  async createType(@Body() body: any) { return this.leaveService.createLeaveType(body); }

  // --- Leave Policies ---
  @Get('policies')
  @RequirePermissions('leave.policy.manage')
  async listPolicies(@Query('status') status?: string, @Query('leaveTypeCode') leaveTypeCode?: string) { return { items: await this.leaveService.listPolicies({ status, leaveTypeCode }) }; }

  @Post('policies')
  @RequirePermissions('leave.policy.manage')
  async createPolicy(@Body() body: any, @CurrentUser() user: RequestUser) { return this.leaveService.createPolicy(body, user); }

  @Post('policies/:id/publish')
  @RequirePermissions('leave.policy.manage')
  async publishPolicy(@Param('id') id: string, @CurrentUser() user: RequestUser) { return this.leaveService.publishPolicy(id, user); }

  // --- Leave Balances ---
  @Get('balances/:employeeId')
  @RequirePermissions('leave.balance.view')
  async getBalances(@Param('employeeId') employeeId: string, @Query('year') year?: string) {
    return { items: await this.leaveService.getBalances(employeeId, year ? parseInt(year, 10) : undefined) };
  }

  @Post('balances/adjust')
  @RequirePermissions('leave.policy.manage')
  async adjustBalance(@Body() body: { employeeId: string; leaveTypeId: string; year: number; adjustment: number; reason: string }, @CurrentUser() user: RequestUser) {
    return this.leaveService.adjustBalance(body.employeeId, body.leaveTypeId, body.year, body.adjustment, body.reason, user);
  }

  // --- Leave Requests ---
  @Get('requests')
  @RequirePermissions('leave.balance.view')
  async listRequests(
    @Query('employeeId') employeeId?: string, @Query('status') status?: string,
    @Query('departmentId') departmentId?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string,
    @CurrentUser() user?: RequestUser,
  ) {
    return this.leaveService.listRequests({ employeeId, status, departmentId, page: page ? parseInt(page, 10) : undefined, pageSize: pageSize ? parseInt(pageSize, 10) : undefined }, user);
  }

  @Post('requests')
  @RequirePermissions('leave.request.create')
  async applyLeave(@Body() body: any, @CurrentUser() user: RequestUser) { return this.leaveService.applyLeave(body, user); }

  @Post('requests/:id/approve')
  @RequirePermissions('leave.request.approve')
  async approveLeave(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body('comment') comment?: string) { return this.leaveService.approveLeave(id, user, comment); }

  @Post('requests/:id/reject')
  @RequirePermissions('leave.request.approve')
  async rejectLeave(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body('comment') comment: string) { return this.leaveService.rejectLeave(id, user, comment); }

  @Post('requests/:id/cancel')
  @RequirePermissions('leave.request.create')
  async cancelLeave(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body('reason') reason: string) { return this.leaveService.cancelLeave(id, user, reason); }

  // --- Holidays ---
  @Get('holidays')
  @RequirePermissions('leave.balance.view')
  async listHolidays(@Query('year') year?: string, @Query('plantId') plantId?: string) {
    return { items: await this.leaveService.listHolidays(year ? parseInt(year, 10) : undefined, plantId) };
  }

  @Post('holidays')
  @RequirePermissions('leave.policy.manage')
  async createHoliday(@Body() body: any) { return this.leaveService.createHoliday(body); }

  @Put('holidays/:id')
  @RequirePermissions('leave.policy.manage')
  async updateHoliday(@Param('id') id: string, @Body() body: any) { return this.leaveService.updateHoliday(id, body); }

  @Delete('holidays/:id')
  @RequirePermissions('leave.policy.manage')
  async deleteHoliday(@Param('id') id: string) { return this.leaveService.deleteHoliday(id); }
}
