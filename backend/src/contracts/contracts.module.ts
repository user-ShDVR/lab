import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PrismaService } from 'src/utils/prisma.service';
import { GeneratePdfService } from 'src/utils/generate-pdf.service';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService, PrismaService, GeneratePdfService],
})
export class ContractsModule {}
