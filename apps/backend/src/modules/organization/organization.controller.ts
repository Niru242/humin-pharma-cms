import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  // ============ COMPANIES ============
  @Get('companies')
  @RequirePermissions('employee.read')
  async listCompanies() { return { items: await this.orgService.listCompanies() }; }

  @Post('companies')
  @RequirePermissions('org.company.manage')
  async createCompany(@Body() body: any) { return this.orgService.createCompany(body); }

  // ============ PLANTS ============
  @Get('plants')
  @RequirePermissions('employee.read')
  async listPlants(@Query('companyId') companyId?: string) { return { items: await this.orgService.listPlants(companyId) }; }

  @Post('plants')
  @RequirePermissions('org.plant.manage')
  async createPlant(@Body() body: any) { return this.orgService.createPlant(body); }

  // ============ DEPARTMENTS ============
  @Get('departments')
  @RequirePermissions('employee.read')
  async listDepartments(@Query('plantId') plantId?: string, @Query('search') search?: string) {
    const items = await this.orgService.listDepartments(plantId, search);
    return { items };
  }

  @Post('departments')
  @RequirePermissions('org.department.manage')
  async createDepartment(@Body() body: any) { return this.orgService.createDepartment(body); }

  @Put('departments/:id')
  @RequirePermissions('org.department.manage')
  async updateDepartment(@Param('id') id: string, @Body() body: any) { return this.orgService.updateDepartment(id, body); }

  @Delete('departments/:id')
  @RequirePermissions('org.department.manage')
  async deleteDepartment(@Param('id') id: string) { return this.orgService.deleteDepartment(id); }

  // ============ DESIGNATIONS ============
  @Get('designations')
  @RequirePermissions('employee.read')
  async listDesignations() { return { items: await this.orgService.listDesignations() }; }

  @Post('designations')
  @RequirePermissions('org.position.manage')
  async createDesignation(@Body() body: any) { return this.orgService.createDesignation(body); }

  // ============ GRADES ============
  @Get('grades')
  @RequirePermissions('employee.read')
  async listGrades() { return { items: await this.orgService.listGrades() }; }

  @Post('grades')
  @RequirePermissions('org.grade.manage')
  async createGrade(@Body() body: any) { return this.orgService.createGrade(body); }

  @Put('grades/:id')
  @RequirePermissions('org.grade.manage')
  async updateGrade(@Param('id') id: string, @Body() body: any) { return this.orgService.updateGrade(id, body); }

  @Delete('grades/:id')
  @RequirePermissions('org.grade.manage')
  async deleteGrade(@Param('id') id: string) { return this.orgService.deleteGrade(id); }

  // ============ EMPLOYEES ============
  @Get('employees')
  @RequirePermissions('employee.read')
  async listEmployees(
    @CurrentUser() user: RequestUser,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.orgService.listEmployees(user, { search, departmentId, status, page: page ? parseInt(page, 10) : undefined, pageSize: pageSize ? parseInt(pageSize, 10) : undefined });
  }

  @Get('employees/:id')
  @RequirePermissions('employee.read')
  async getEmployee(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.orgService.getEmployee(id, user);
  }

  @Post('employees')
  @RequirePermissions('employee.create')
  async createEmployee(@Body() body: any, @CurrentUser() user: RequestUser) {
    return this.orgService.createEmployee(body, user);
  }

  @Put('employees/:id')
  @RequirePermissions('employee.update')
  async updateEmployee(@Param('id') id: string, @Body() body: any, @CurrentUser() user: RequestUser) {
    return this.orgService.updateEmployee(id, body, user);
  }

  @Delete('employees/:id')
  @RequirePermissions('employee.deactivate')
  async deactivateEmployee(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body('reason') reason: string) {
    return this.orgService.deactivateEmployee(id, user, reason);
  }
}
