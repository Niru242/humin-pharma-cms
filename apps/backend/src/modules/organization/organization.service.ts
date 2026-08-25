import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Company } from './entities/company.entity';
import { Plant } from './entities/plant.entity';
import { Department } from './entities/department.entity';
import { Designation } from './entities/designation.entity';
import { Grade } from './entities/grade.entity';
import { Employee } from './entities/employee.entity';
import { DataScopeService } from '../auth/services/data-scope.service';
import { FieldAccessService } from '../auth/services/field-access.service';
import { RequestUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Company) private readonly companyRepo: Repository<Company>,
    @InjectRepository(Plant) private readonly plantRepo: Repository<Plant>,
    @InjectRepository(Department) private readonly deptRepo: Repository<Department>,
    @InjectRepository(Designation) private readonly desigRepo: Repository<Designation>,
    @InjectRepository(Grade) private readonly gradeRepo: Repository<Grade>,
    @InjectRepository(Employee) private readonly empRepo: Repository<Employee>,
    private readonly dataScopeService: DataScopeService,
    private readonly fieldAccessService: FieldAccessService,
  ) {}

  // ============ COMPANIES ============
  async listCompanies() {
    return this.companyRepo.find({ where: { isActive: true }, order: { name: 'ASC' } });
  }
  async createCompany(data: Partial<Company>) {
    const existing = await this.companyRepo.findOneBy({ code: data.code });
    if (existing) throw new ConflictException('Company code already exists');
    return this.companyRepo.save(this.companyRepo.create(data));
  }

  // ============ PLANTS ============
  async listPlants(companyId?: string) {
    const where: any = { isActive: true };
    if (companyId) where.companyId = companyId;
    return this.plantRepo.find({ where, order: { name: 'ASC' }, relations: ['company'] });
  }
  async createPlant(data: Partial<Plant>) {
    const existing = await this.plantRepo.findOneBy({ code: data.code });
    if (existing) throw new ConflictException('Plant code already exists');
    return this.plantRepo.save(this.plantRepo.create(data));
  }

  // ============ DEPARTMENTS ============
  async listDepartments(plantId?: string, search?: string) {
    const qb = this.deptRepo.createQueryBuilder('d')
      .leftJoinAndSelect('d.plant', 'plant')
      .where('d.is_active = true');
    if (plantId) qb.andWhere('d.plant_id = :plantId', { plantId });
    if (search) qb.andWhere('(d.name LIKE :s OR d.code LIKE :s)', { s: `%${search}%` });
    qb.orderBy('d.name', 'ASC');
    return qb.getMany();
  }
  async createDepartment(data: Partial<Department>) {
    const existing = await this.deptRepo.findOneBy({ code: data.code });
    if (existing) throw new ConflictException('Department code already exists');
    return this.deptRepo.save(this.deptRepo.create(data));
  }
  async updateDepartment(id: string, data: Partial<Department>) {
    const dept = await this.deptRepo.findOneBy({ id });
    if (!dept) throw new NotFoundException('Department not found');
    Object.assign(dept, data);
    return this.deptRepo.save(dept);
  }
  async deleteDepartment(id: string) {
    const dept = await this.deptRepo.findOneBy({ id });
    if (!dept) throw new NotFoundException('Department not found');
    dept.isActive = false; dept.deactivatedAt = new Date();
    return this.deptRepo.save(dept);
  }

  // ============ DESIGNATIONS ============
  async listDesignations() {
    return this.desigRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
  }
  async createDesignation(data: Partial<Designation>) {
    return this.desigRepo.save(this.desigRepo.create(data));
  }

  // ============ GRADES ============
  async listGrades() {
    return this.gradeRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
  }
  async createGrade(data: Partial<Grade>) {
    const existing = await this.gradeRepo.findOneBy({ code: data.code });
    if (existing) throw new ConflictException('Grade code already exists');
    return this.gradeRepo.save(this.gradeRepo.create(data));
  }
  async updateGrade(id: string, data: Partial<Grade>) {
    const grade = await this.gradeRepo.findOneBy({ id });
    if (!grade) throw new NotFoundException('Grade not found');
    Object.assign(grade, data);
    return this.gradeRepo.save(grade);
  }
  async deleteGrade(id: string) {
    const grade = await this.gradeRepo.findOneBy({ id });
    if (!grade) throw new NotFoundException('Grade not found');
    grade.isActive = false; grade.deactivatedAt = new Date();
    return this.gradeRepo.save(grade);
  }

  // ============ EMPLOYEES ============
  async listEmployees(user: RequestUser, filters?: { search?: string; departmentId?: string; status?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize || 20));

    const qb = this.empRepo.createQueryBuilder('employee').where('employee.is_active = true');

    // Apply data scope (Layer 2)
    this.dataScopeService.applyScope(qb, user, 'employee');

    if (filters?.search) {
      qb.andWhere('(employee.first_name LIKE :s OR employee.last_name LIKE :s OR employee.employee_code LIKE :s OR employee.email LIKE :s)', { s: `%${filters.search}%` });
    }
    if (filters?.departmentId) qb.andWhere('employee.department_id = :did', { did: filters.departmentId });
    if (filters?.status) qb.andWhere('employee.employment_status = :status', { status: filters.status });

    qb.orderBy('employee.first_name', 'ASC');
    const [items, totalItems] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    // Apply field-level masking (Layer 3)
    const filtered = this.fieldAccessService.filterFieldsList(items as any[], user, 'employee');

    return { items: filtered, pageInfo: { page, pageSize, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }

  async getEmployee(id: string, user: RequestUser) {
    const emp = await this.empRepo.findOneBy({ id, isActive: true });
    if (!emp) throw new NotFoundException('Employee not found');

    // Check data scope access
    if (!this.dataScopeService.canAccessRecord(user, { companyId: emp.companyId || undefined, plantId: emp.plantId || undefined, departmentId: emp.departmentId || undefined, userId: emp.userId || undefined })) {
      throw new NotFoundException('Employee not found'); // Don't reveal existence
    }

    const isSelf = emp.userId === user.id;
    return this.fieldAccessService.filterFields(emp as any, user, 'employee', isSelf);
  }

  async createEmployee(data: Partial<Employee>, user: RequestUser) {
    // Duplicate check (Section 8)
    if (data.employeeCode) {
      const existing = await this.empRepo.findOneBy({ employeeCode: data.employeeCode });
      if (existing) throw new ConflictException('Employee code already exists');
    }

    const emp = this.empRepo.create({ ...data, createdBy: user.id });
    return this.empRepo.save(emp);
  }

  async updateEmployee(id: string, data: Partial<Employee>, user: RequestUser) {
    const emp = await this.empRepo.findOneBy({ id, isActive: true });
    if (!emp) throw new NotFoundException('Employee not found');
    Object.assign(emp, data, { updatedBy: user.id });
    return this.empRepo.save(emp);
  }

  async deactivateEmployee(id: string, user: RequestUser, reason: string) {
    const emp = await this.empRepo.findOneBy({ id });
    if (!emp) throw new NotFoundException('Employee not found');
    emp.isActive = false;
    emp.deactivatedAt = new Date();
    emp.employmentStatus = 'Separated';
    emp.separationDate = new Date().toISOString().slice(0, 10);
    return this.empRepo.save(emp);
  }
}
