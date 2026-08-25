import { Module } from '@nestjs/common';
import { MigrationToolService } from './migration-tool.service';
import { MigrationToolController } from './migration-tool.controller';

@Module({
  controllers: [MigrationToolController],
  providers: [MigrationToolService],
})
export class MigrationToolModule {}
