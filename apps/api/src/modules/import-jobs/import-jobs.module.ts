import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportJob } from './entities/import-job.entity';
import { ImportJobsService } from './import-jobs.service';
import { ImportJobsController } from './import-jobs.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ImportJob])],
  controllers: [ImportJobsController],
  providers: [ImportJobsService],
  exports: [ImportJobsService],
})
export class ImportJobsModule {}
