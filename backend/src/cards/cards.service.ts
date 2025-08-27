import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from '@prisma/client';


@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    return this.prisma.card.create({
      data: {
        title: createCardDto.title,
        content: createCardDto.content || '',
        order: createCardDto.order,
        columnId: createCardDto.columnId,
        userId: createCardDto.userId,
      },
    });
  }

  async findAll(columnId: string) {
    return this.prisma.card.findMany({
      where: { columnId },
      orderBy: { order: 'asc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.card.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const updateData: any = {};
    
    if (updateCardDto.title !== undefined) updateData.title = updateCardDto.title;
    if (updateCardDto.content !== undefined) updateData.content = updateCardDto.content;
    if (updateCardDto.order !== undefined) updateData.order = updateCardDto.order;
    if (updateCardDto.columnId !== undefined) updateData.columnId = updateCardDto.columnId;
    if (updateCardDto.userId !== undefined) updateData.userId = updateCardDto.userId;

    return this.prisma.card.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.card.delete({
      where: { id }
    });
  }

  async moveCard(id: string, columnId: string, order: number) {
    return this.prisma.card.update({
      where: { id },
      data: {
        columnId,
        order
      },
    });
  }

  async reorderCards(cards: { id: string; order: number }[]) {
    const results: Card[] = [];
    for (const { id, order } of cards) {
      const result = await this.prisma.card.update({
        where: { id },
        data: { order },
      });
      results.push(result);
    }
    return results;
  }
}