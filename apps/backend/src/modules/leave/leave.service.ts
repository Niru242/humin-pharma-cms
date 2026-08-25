import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from './entities/leave-type.entity';
import { LeavePolicy } from './entities/leave-policy.entity';
import { LeaveBalance } from './entities/leave-balance.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { Holiday } from './entities/holiday.entity';
import { WorkflowService } from '../workflow/workflow.service';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveType) private readonly typeRepo: Repository<LeaveType>,
    @InjectRepository(LeavePolicy) private readonly policyRepo: Repository<LeavePolicy>,
    @InjectRepository(LeaveBalance) private readonly balanceRepo: Repository<LeaveBalance>,
    @InjectRepository(LeaveRequest) private readonly requestRepo: Repository<LeaveRequest>,
    @InjectRepository(Holiday) private readonly holidayRepo: Repository<Holiday>,
    private readonly workflowService: WorkflowService,
    private readonly auditService: AuditService,
  ) {}

  // ============ LEAVE TYPES ============
  async listLeaveTypes() { return this.typeRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } }); }
  async createLeaveType(data: Partial<LeaveType>) {
    const existing = await this.typeRepo.findOneBy({ code: data.code });
    if (existing) throw new ConflictException('Leave type code exists');
    return this.typeRepo.save(this.typeRepo.create(data));
  }

  // ============ LEAVE POLICIES ============
  async listPolicies(filters?: { status?: string; leaveTypeCode?: string }) {
    const qb = this.policyRepo.createQueryBuilder('p').where('p.is_active = true');
    if (filters?.status) qb.andWhere('p.status = :s', { s: filters.status });
    if (filters?.leaveTypeCode) qb.andWhere('p.leave_type_code = :ltc', { ltc: filters.leaveTypeCode });
    return qb.orderBy('p.name', 'ASC').getMany();
  }
  async createPolicy(data: Partial<LeavePolicy>, user: RequestUser) {
    return this.policyRepo.save(this.policyRepo.create({ ...data, status: 'draft', createdBy: user.id }));
  }
  async publishPolicy(id: string, user: RequestUser) {
    const p = await this.policyRepo.findOneBy({ id, status: 'draft' });
    if (!p) throw new NotFoundException('Policy not found or not in draft');
    p.status = 'published'; p.publishedBy = user.id; p.publishedAt = new Date();
    return this.policyRepo.save(p);
  }

  // ============ LEAVE BALANCES ============
  async getBalances(employeeId: string, year?: number) {
    const y = year || new Date().getFullYear();
    const balances = await this.balanceRepo.find({ where: { employeeId, year: y } });
    return balances.map(b => ({
      ...b,
      balance: Number(b.entitled) + Number(b.carryForward) + Number(b.adjustment) - Number(b.used) - Number(b.pending),
    }));
  }
  async adjustBalance(employeeId: string, leaveTypeId: string, year: number, adjustment: number, reason: string, user: RequestUser) {
    let bal = await this.balanceRepo.findOneBy({ employeeId, leaveTypeId, year });
    if (!bal) throw new NotFoundException('Balance record not found');
    bal.adjustment = Number(bal.adjustment) + adjustment;
    await this.balanceRepo.save(bal);
    await this.auditService.log({ actorId: user.id, actorEmail: user.email, action: 'adjust_balance', module: 'leave', entityType: 'LeaveBalance', entityId: bal.id, newValues: { adjustment, reason } as any, reason });
    return bal;
  }

  // ============ LEAVE REQUESTS ============
  async listRequests(filters?: { employeeId?: string; status?: string; departmentId?: string; page?: number; pageSize?: number }, user?: RequestUser) {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize || 20));
    const qb = this.requestRepo.createQueryBuilder('lr').where('lr.is_active = true');
    if (filters?.employeeId) qb.andWhere('lr.employee_id = :eid', { eid: filters.employeeId });
    if (filters?.status) qb.andWhere('lr.status = :s', { s: filters.status });
    if (filters?.departmentId) qb.andWhere('lr.department_id = :did', { did: filters.departmentId });
    qb.orderBy('lr.created_at', 'DESC');
    const [items, totalItems] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);
    return { items, pageInfo: { page, pageSize, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }

  async applyLeave(data: Partial<LeaveRequest>, user: RequestUser) {
    // Check balance
    const year = new Date(data.startDate as string).getFullYear();
    const balance = await this.balanceRepo.findOneBy({ employeeId: data.employeeId, leaveTypeId: data.leaveTypeId, year });
    if (balance) {
      const available = Number(balance.entitled) + Number(balance.carryForward) + Number(balance.adjustment) - Number(balance.used) - Number(balance.pending);
      if (available < Number(data.totalDays)) {
        throw new BadRequestException(`Insufficient leave balance. Available: ${available}, Requested: ${data.totalDays}`);
      }
    }

    const request = this.requestRepo.create({ ...data, status: 'pending', createdBy: user.id });
    const saved = await this.requestRepo.save(request);

    // Update pending balance
    if (balance) {
      balance.pending = Number(balance.pending) + Number(data.totalDays);
      await this.balanceRepo.save(balance);
    }

    // Start workflow
    if (data.approverId) {
      const wf = await this.workflowService.startWorkflow({
        definitionCode: 'leave_request',
        entityType: 'LeaveRequest',
        entityId: saved.id,
        requesterId: user.id,
        requesterName: data.employeeName || user.email,
        assigneeId: data.approverId,
        assigneeName: data.approverName || 'Manager',
        title: `Leave request: ${data.leaveTypeName} (${data.totalDays} days)`,
      });
      saved.workflowInstanceId = wf.id;
      await this.requestRepo.save(saved);
    }

    return saved;
  }

  async approveLeave(id: string, user: RequestUser, comment?: string) {
    const req = await this.requestRepo.findOneBy({ id, status: 'pending' });
    if (!req) throw new NotFoundException('Leave request not found or not pending');
    if (req.employeeId === user.id) throw new BadRequestException('Cannot approve own leave');

    req.status = 'approved';
    req.approverId = user.id;
    req.approverName = user.email;
    req.approvedAt = new Date();
    req.approverComment = comment || null;
    await this.requestRepo.save(req);

    // Move pending to used
    const year = new Date(req.startDate).getFullYear();
    const balance = await this.balanceRepo.findOneBy({ employeeId: req.employeeId, leaveTypeId: req.leaveTypeId, year });
    if (balance) {
      balance.pending = Math.max(0, Number(balance.pending) - Number(req.totalDays));
      balance.used = Number(balance.used) + Number(req.totalDays);
      await this.balanceRepo.save(balance);
    }

    return req;
  }

  async rejectLeave(id: string, user: RequestUser, comment: string) {
    const req = await this.requestRepo.findOneBy({ id, status: 'pending' });
    if (!req) throw new NotFoundException('Leave request not found or not pending');

    req.status = 'rejected';
    req.approverId = user.id;
    req.approverName = user.email;
    req.approverComment = comment;
    await this.requestRepo.save(req);

    // Release pending balance
    const year = new Date(req.startDate).getFullYear();
    const balance = await this.balanceRepo.findOneBy({ employeeId: req.employeeId, leaveTypeId: req.leaveTypeId, year });
    if (balance) {
      balance.pending = Math.max(0, Number(balance.pending) - Number(req.totalDays));
      await this.balanceRepo.save(balance);
    }

    return req;
  }

  async cancelLeave(id: string, user: RequestUser, reason: string) {
    const req = await this.requestRepo.findOneBy({ id });
    if (!req) throw new NotFoundException('Leave request not found');
    if (!['pending', 'approved'].includes(req.status)) throw new BadRequestException('Cannot cancel this request');

    const prevStatus = req.status;
    req.status = 'cancelled';
    await this.requestRepo.save(req);

    const year = new Date(req.startDate).getFullYear();
    const balance = await this.balanceRepo.findOneBy({ employeeId: req.employeeId, leaveTypeId: req.leaveTypeId, year });
    if (balance) {
      if (prevStatus === 'pending') balance.pending = Math.max(0, Number(balance.pending) - Number(req.totalDays));
      if (prevStatus === 'approved') balance.used = Math.max(0, Number(balance.used) - Number(req.totalDays));
      await this.balanceRepo.save(balance);
    }

    return req;
  }

  // ============ HOLIDAYS ============
  async listHolidays(year?: number, plantId?: string) {
    const qb = this.holidayRepo.createQueryBuilder('h').where('h.is_active = true');
    if (year) qb.andWhere('h.year = :y', { y: year });
    if (plantId) qb.andWhere('(h.plant_id = :pid OR h.plant_id IS NULL)', { pid: plantId });
    return qb.orderBy('h.date', 'ASC').getMany();
  }
  async createHoliday(data: Partial<Holiday>) {
    return this.holidayRepo.save(this.holidayRepo.create(data));
  }
  async updateHoliday(id: string, data: Partial<Holiday>) {
    const h = await this.holidayRepo.findOneBy({ id });
    if (!h) throw new NotFoundException('Holiday not found');
    Object.assign(h, data);
    return this.holidayRepo.save(h);
  }
  async deleteHoliday(id: string) {
    const h = await this.holidayRepo.findOneBy({ id });
    if (!h) throw new NotFoundException('Holiday not found');
    h.isActive = false; h.deactivatedAt = new Date();
    return this.holidayRepo.save(h);
  }
}
