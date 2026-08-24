import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('document_templates')
@Index('idx_doc_templates_code', ['code'])
@Index('idx_doc_templates_type', ['templateType'])
export class DocumentTemplate extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 20, name: 'template_type' })
  templateType: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'text' })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'json', nullable: true, name: 'available_variables' })
  availableVariables: string[] | null;

  @Column({ type: 'int', default: 1, name: 'template_version' })
  templateVersion: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'published_by' })
  publishedBy: string | null;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'published_at' })
  publishedAt: Date | null;
}
