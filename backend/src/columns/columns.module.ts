import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { ColumnsGateway } from './columns.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService, ColumnsGateway, PrismaService]
})
export class ColumnsModule {}
