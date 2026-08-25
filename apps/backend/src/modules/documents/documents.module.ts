import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Document } from './entities/document.entity';
import { DocumentTemplate } from './entities/document-template.entity';
import { DocumentsService } from './documents.service';
import { StorageService } from './storage.service';
import { DocumentsController } from './documents.controller';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Document, DocumentTemplate]),
    MulterModule.register({}),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, StorageService],
  exports: [DocumentsService, StorageService],
})
export class DocumentsModule {}
