import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fsNode from 'fs';

const ALLOWED_EXTENSIONS = new Set(['.pdf','.doc','.docx','.xls','.xlsx','.csv','.jpg','.jpeg','.png','.gif','.txt','.zip']);
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export interface UploadResult {
  storedName: string;
  storagePath: string;
  storageBucket: string;
  checksum: string;
  mimeType: string;
  extension: string;
  fileSize: number;
}

export interface FileValidation {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class StorageService {
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = configService.get('MINIO_BUCKET', 'pharma-hrms-docs');
    this.endpoint = configService.get('MINIO_ENDPOINT', 'localhost');
  }

  async uploadFile(file: FileValidation, category: string): Promise<UploadResult> {
    if (file.size > MAX_FILE_SIZE) throw new BadRequestException('File too large (max 25MB)');
    if (file.size === 0) throw new BadRequestException('Empty file');

    const ext = path.extname(file.originalName).toLowerCase();

    const checksum = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const storedName = crypto.randomUUID() + ext;
    const datePath = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
    const storagePath = category + '/' + datePath + '/' + storedName;

    // Local filesystem fallback (replace with S3 SDK in production)
    const dir = path.resolve(process.cwd(), 'storage', this.bucket, path.dirname(storagePath));
    fsNode.mkdirSync(dir, { recursive: true });
    fsNode.writeFileSync(path.resolve(dir, path.basename(storagePath)), file.buffer);

    return { storedName, storagePath, storageBucket: this.bucket, checksum, mimeType: file.mimeType, extension: ext, fileSize: file.size };
  }

  async downloadFile(storagePath: string): Promise<Buffer> {
    const filePath = path.resolve(process.cwd(), 'storage', this.bucket, storagePath);
    return fsNode.readFileSync(filePath);
  }

  async deleteFile(storagePath: string): Promise<void> {
    const filePath = path.resolve(process.cwd(), 'storage', this.bucket, storagePath);
    if (fsNode.existsSync(filePath)) fsNode.unlinkSync(filePath);
  }
}
