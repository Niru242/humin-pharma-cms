import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { DocumentTemplate } from './entities/document-template.entity';
import { StorageService, FileValidation } from './storage.service';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private readonly docRepo: Repository<Document>,
    @InjectRepository(DocumentTemplate) private readonly templateRepo: Repository<DocumentTemplate>,
    private readonly storageService: StorageService,
    private readonly auditService: AuditService,
  ) {}

  async upload(file: FileValidation, user: RequestUser, options: { entityType?: string; entityId?: string; category?: string; description?: string; sensitivityTier?: string }) {
    const category = options.category || 'general';
    const result = await this.storageService.uploadFile(file, category);
    const doc = this.docRepo.create({
      originalName: file.originalName, storedName: result.storedName, mimeType: result.mimeType,
      extension: result.extension, fileSize: result.fileSize, checksum: result.checksum,
      storagePath: result.storagePath, storageBucket: result.storageBucket,
      entityType: options.entityType || null, entityId: options.entityId || null, category,
      uploadedById: user.id, uploadedByName: user.email,
      sensitivityTier: options.sensitivityTier || 'internal', description: options.description || null,
    });
    const saved = await this.docRepo.save(doc);
    await this.auditService.log({ actorId: user.id, actorEmail: user.email, action: 'upload', module: 'documents', entityType: 'Document', entityId: saved.id });
    return saved;
  }

  async uploadVersion(documentId: string, file: FileValidation, user: RequestUser) {
    const existing = await this.docRepo.findOneBy({ id: documentId, isLatest: true });
    if (!existing) throw new NotFoundException('Document not found');
    existing.isLatest = false;
    await this.docRepo.save(existing);
    const result = await this.storageService.uploadFile(file, existing.category || 'general');
    const newDoc = this.docRepo.create({
      originalName: file.originalName, storedName: result.storedName, mimeType: result.mimeType,
      extension: result.extension, fileSize: result.fileSize, checksum: result.checksum,
      storagePath: result.storagePath, storageBucket: result.storageBucket,
      entityType: existing.entityType, entityId: existing.entityId, category: existing.category,
      uploadedById: user.id, uploadedByName: user.email, sensitivityTier: existing.sensitivityTier,
      documentVersion: existing.documentVersion + 1, parentDocumentId: existing.id, isLatest: true,
    });
    return this.docRepo.save(newDoc);
  }

  async getByEntity(entityType: string, entityId: string) {
    return this.docRepo.find({ where: { entityType, entityId, isActive: true, isLatest: true }, order: { createdAt: 'DESC' } });
  }

  async getById(id: string) {
    const doc = await this.docRepo.findOneBy({ id, isActive: true });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async download(id: string, user: RequestUser) {
    const doc = await this.getById(id);
    await this.auditService.log({ actorId: user.id, actorEmail: user.email, action: 'download', module: 'documents', entityType: 'Document', entityId: doc.id });
    const buffer = await this.storageService.downloadFile(doc.storagePath);
    return { buffer, document: doc };
  }

  async softDelete(id: string, user: RequestUser, reason: string) {
    const doc = await this.getById(id);
    if (doc.legalHold) throw new BadRequestException('Document is under legal hold');
    doc.isActive = false;
    doc.deactivatedAt = new Date();
    await this.docRepo.save(doc);
    await this.auditService.log({ actorId: user.id, actorEmail: user.email, action: 'deactivate', module: 'documents', entityType: 'Document', entityId: id, reason });
  }

  async listTemplates(filters?: { templateType?: string; module?: string; status?: string }) {
    const qb = this.templateRepo.createQueryBuilder('t').where('t.is_active = true');
    if (filters?.templateType) qb.andWhere('t.template_type = :tt', { tt: filters.templateType });
    if (filters?.module) qb.andWhere('t.module = :mod', { mod: filters.module });
    if (filters?.status) qb.andWhere('t.status = :status', { status: filters.status });
    return qb.orderBy('t.name', 'ASC').getMany();
  }

  async getTemplateByCode(code: string) {
    const t = await this.templateRepo.findOne({ where: { code, status: 'published', isActive: true }, order: { templateVersion: 'DESC' } });
    if (!t) throw new NotFoundException('Template not found: ' + code);
    return t;
  }

  async createTemplate(data: Partial<DocumentTemplate>, user: RequestUser) {
    const t = this.templateRepo.create({ ...data, status: 'draft', templateVersion: 1, createdBy: user.id } as any);
    return this.templateRepo.save(t);
  }

  async updateTemplate(id: string, data: Partial<DocumentTemplate>, user: RequestUser) {
    const t = await this.templateRepo.findOneBy({ id, status: 'draft' });
    if (!t) throw new NotFoundException('Template not found or not draft');
    Object.assign(t, data, { updatedBy: user.id });
    return this.templateRepo.save(t);
  }

  async publishTemplate(id: string, user: RequestUser) {
    const t = await this.templateRepo.findOneBy({ id, status: 'draft' });
    if (!t) throw new NotFoundException('Template not found or not draft');
    t.status = 'published';
    t.publishedBy = user.id;
    t.publishedAt = new Date();
    return this.templateRepo.save(t);
  }

  async renderTemplate(code: string, variables: Record<string, string>) {
    const t = await this.getTemplateByCode(code);
    let subject = t.subject;
    let body = t.body;
    for (const [key, value] of Object.entries(variables)) {
      const ph = '{{' + key + '}}';
      subject = subject.split(ph).join(value);
      body = body.split(ph).join(value);
    }
    return { subject, body };
  }
}
