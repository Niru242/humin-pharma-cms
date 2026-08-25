import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportJob } from './entities/import-job.entity';
import { RequestUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class ImportJobsService {
  constructor(
    @InjectRepository(ImportJob)
    private readonly jobRepo: Repository<ImportJob>,
  ) {}

  /** Create a new import job (returns immediately with job ID — async pattern). */
  async createJob(params: { jobType: string; fileName?: string; fileChecksum?: string; totalRows?: number }, user: RequestUser): Promise<ImportJob> {
    // Idempotency: reject duplicate file by checksum
    if (params.fileChecksum) {
      const existing = await this.jobRepo.findOne({
        where: { fileChecksum: params.fileChecksum, jobType: params.jobType, status: 'completed' },
      });
      if (existing) throw new ConflictException('This file has already been imported successfully');
    }

    const job = this.jobRepo.create({
      jobType: params.jobType,
      fileName: params.fileName || null,
      fileChecksum: params.fileChecksum || null,
      initiatedById: user.id,
      initiatedByName: user.email,
      totalRows: params.totalRows || 0,
      status: 'pending',
    });
    return this.jobRepo.save(job);
  }

  /** Update job progress. */
  async updateProgress(jobId: string, update: { processedRows?: number; successRows?: number; errorRows?: number; skippedRows?: number; progressPercent?: number; status?: string; errors?: any[] }): Promise<void> {
    const data: Partial<ImportJob> = {};
    if (update.processedRows !== undefined) data.processedRows = update.processedRows;
    if (update.successRows !== undefined) data.successRows = update.successRows;
    if (update.errorRows !== undefined) data.errorRows = update.errorRows;
    if (update.skippedRows !== undefined) data.skippedRows = update.skippedRows;
    if (update.progressPercent !== undefined) data.progressPercent = update.progressPercent;
    if (update.status) {
      data.status = update.status;
      if (update.status === 'processing' && !data.startedAt) data.startedAt = new Date();
      if (['completed', 'partially_completed', 'failed'].includes(update.status)) data.completedAt = new Date();
    }
    await this.jobRepo.update(jobId, data as any);
    if (update.errors && update.errors.length > 0) {
      // Append errors (load current, merge, save)
      const job = await this.jobRepo.findOneBy({ id: jobId });
      if (job) {
        job.errors = [...(job.errors || []), ...update.errors] as any;
        await this.jobRepo.save(job);
      }
    }
  }

  /** Get job by ID. */
  async getById(id: string): Promise<ImportJob> {
    const job = await this.jobRepo.findOneBy({ id });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  /** List jobs (paginated, filterable). */
  async list(filters?: { jobType?: string; status?: string; page?: number; pageSize?: number }, user?: RequestUser) {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize || 20));

    const qb = this.jobRepo.createQueryBuilder('job').where('job.is_active = true');
    if (filters?.jobType) qb.andWhere('job.job_type = :jt', { jt: filters.jobType });
    if (filters?.status) qb.andWhere('job.status = :status', { status: filters.status });

    qb.orderBy('job.created_at', 'DESC');
    const [items, totalItems] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    return { items, pageInfo: { page, pageSize, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
  }

  /** Cancel a pending/processing job. */
  async cancel(id: string): Promise<ImportJob> {
    const job = await this.getById(id);
    if (!['pending', 'processing'].includes(job.status)) {
      throw new ConflictException('Can only cancel pending or processing jobs');
    }
    job.status = 'cancelled';
    job.completedAt = new Date();
    return this.jobRepo.save(job);
  }

  /** Retry a failed job. */
  async retry(id: string): Promise<ImportJob> {
    const job = await this.getById(id);
    if (job.status !== 'failed') throw new ConflictException('Can only retry failed jobs');
    job.status = 'pending';
    job.processedRows = 0;
    job.successRows = 0;
    job.errorRows = 0;
    job.progressPercent = 0;
    job.errors = null;
    job.completedAt = null;
    job.startedAt = null;
    job.errorMessage = null;
    return this.jobRepo.save(job);
  }
}
