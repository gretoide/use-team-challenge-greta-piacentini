import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardsGateway } from './cards.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, CardsGateway, PrismaService]
})
export class CardsModule {}
