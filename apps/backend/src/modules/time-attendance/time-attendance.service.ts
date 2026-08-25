import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { Roster } from './entities/roster.entity';
import { RawPunch } from './entities/raw-punch.entity';
import { DailyAttendance } from './entities/daily-attendance.entity';
import { AttendancePeriod } from './entities/attendance-period.entity';
import { ImportJobsService } from '../import-jobs/import-jobs.service';
import { RequestUser } from '../auth/decorators/current-user.decorator';
import * as crypto from 'crypto';

@Injectable()
export class TimeAttendanceService {
  constructor(
    @InjectRepository(Shift) private readonly shiftRepo: Repository<Shift>,
    @InjectRepository(Roster) private readonly rosterRepo: Repository<Roster>,
    @InjectRepository(RawPunch) private readonly punchRepo: Repository<RawPunch>,
    @InjectRepository(DailyAttendance) private readonly dailyRepo: Repository<DailyAttendance>,
    @InjectRepository(AttendancePeriod) private readonly periodRepo: Repository<AttendancePeriod>,
    private readonly importJobsService: ImportJobsService,
  ) {}

  // ============ SHIFTS ============
  async listShifts() {
    return this.shiftRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC', name: 'ASC' } as any });
  }
  async createShift(data: Partial<Shift>) {
    const existing = await this.shiftRepo.findOneBy({ code: data.code });
    if (existing) throw new ConflictException('Shift code already exists');
    return this.shiftRepo.save(this.shiftRepo.create(data));
  }
  async updateShift(id: string, data: Partial<Shift>) {
    const shift = await this.shiftRepo.findOneBy({ id });
    if (!shift) throw new NotFoundException('Shift not found');
    Object.assign(shift, data);
    return this.shiftRepo.save(shift);
  }

  // ============ ROSTER ============
  async getRoster(employeeId: string, month: number, year: number) {
    return this.rosterRepo.find({
      where: { employeeId },
      order: { date: 'ASC' },
    });
  }
  async assignRoster(data: Partial<Roster>[]) {
    return this.rosterRepo.save(data.map(d => this.rosterRepo.create(d)));
  }

  // ============ RAW PUNCHES ============
  async listRawPunches(filters?: { employeeCode?: string; dateFrom?: string; dateTo?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize || 50));

    const qb = this.punchRepo.createQueryBuilder('p');
    if (filters?.employeeCode) qb.andWhere('p.employee_code = :ec', { ec: filters.employeeCode });
    if (filters?.dateFrom) qb.andWhere('p.punch_time >= :df', { df: filters.dateFrom });
    if (filters?.dateTo) qb.andWhere('p.punch_time <= :dt', { dt: filters.dateTo });
    qb.orderBy('p.punch_time', 'DESC');

    const [items, totalItems] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);
    return { items, pageInfo: { page, pageSize, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }

  /** Import biometric punches (idempotent by row hash). */
  async importPunches(punches: Array<{ employeeCode: string; punchTime: string; punchType?: string; deviceId?: string }>, user: RequestUser) {
    const job = await this.importJobsService.createJob({ jobType: 'biometric_import', totalRows: punches.length }, user);
    let success = 0, skipped = 0, errors = 0;

    for (const punch of punches) {
      try {
        const hash = crypto.createHash('sha256').update(`${punch.employeeCode}|${punch.punchTime}`).digest('hex');
        // Dedup check
        const existing = await this.punchRepo.findOneBy({ rawDataHash: hash });
        if (existing) { skipped++; continue; }

        await this.punchRepo.save({
          employeeCode: punch.employeeCode,
          punchTime: new Date(punch.punchTime),
          punchType: punch.punchType || 'UNKNOWN',
          deviceId: punch.deviceId || null,
          importJobId: job.id,
          sourceType: 'biometric',
          rawDataHash: hash,
        } as any);
        success++;
      } catch { errors++; }
    }

    await this.importJobsService.updateProgress(job.id, { status: 'completed', processedRows: punches.length, successRows: success, skippedRows: skipped, errorRows: errors, progressPercent: 100 });
    return { jobId: job.id, total: punches.length, success, skipped, errors };
  }

  // ============ DAILY ATTENDANCE ============
  async listDailyAttendance(filters?: { employeeId?: string; month?: number; year?: number; status?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize || 31));

    const qb = this.dailyRepo.createQueryBuilder('da').where('da.is_active = true');
    if (filters?.employeeId) qb.andWhere('da.employee_id = :eid', { eid: filters.employeeId });
    if (filters?.month) qb.andWhere('da.period_month = :m', { m: filters.month });
    if (filters?.year) qb.andWhere('da.period_year = :y', { y: filters.year });
    if (filters?.status) qb.andWhere('da.status = :s', { s: filters.status });
    qb.orderBy('da.date', 'DESC');

    const [items, totalItems] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);
    return { items, pageInfo: { page, pageSize, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }

  async getMonthlySummary(employeeId: string, month: number, year: number) {
    const records = await this.dailyRepo.find({ where: { employeeId, periodMonth: month, periodYear: year, isActive: true }, order: { date: 'ASC' } });
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const halfDay = records.filter(r => r.status === 'half_day').length;
    const leave = records.filter(r => r.status === 'leave').length;
    const weeklyOff = records.filter(r => r.status === 'weekly_off').length;
    const holiday = records.filter(r => r.status === 'holiday').length;
    const totalOT = records.reduce((sum, r) => sum + r.overtimeMinutes, 0);
    const totalLate = records.reduce((sum, r) => sum + r.lateMinutes, 0);

    return { employeeId, month, year, totalDays: records.length, present, absent, halfDay, leave, weeklyOff, holiday, totalOvertimeMinutes: totalOT, totalLateMinutes: totalLate, records };
  }

  // ============ ATTENDANCE PERIODS ============
  async listPeriods(plantId?: string) {
    const where: any = {};
    if (plantId) where.plantId = plantId;
    return this.periodRepo.find({ where, order: { year: 'DESC', month: 'DESC' } });
  }

  async lockPeriod(plantId: string, month: number, year: number, userId: string) {
    const period = await this.periodRepo.findOneBy({ plantId, month, year });
    if (!period) throw new NotFoundException('Period not found');
    if (period.status === 'locked') throw new ConflictException('Period is already locked');
    period.status = 'locked';
    period.lockedAt = new Date();
    period.lockedBy = userId;
    await this.periodRepo.save(period);
    // Lock all daily records in this period
    await this.dailyRepo.update({ plantId, periodMonth: month, periodYear: year }, { isLocked: true } as any);
    return period;
  }
}
