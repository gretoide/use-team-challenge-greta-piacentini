import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    return this.prisma.card.create({
      data: {
        title: createCardDto.title,
        content: createCardDto.content,
        order: createCardDto.order,
        column: {
          connect: { id: createCardDto.columnId }
        },
        user: createCardDto.userId ? {
          connect: { id: createCardDto.userId }
        } : undefined
      },
      include: {
        user: true,
        column: true
      }
    });
  }

  async findAll(columnId: string) {
    return this.prisma.card.findMany({
      where: { columnId },
      include: {
        user: true
      },
      orderBy: { order: 'asc' }
    });
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    return this.prisma.card.update({
      where: { id },
      data: {
        title: updateCardDto.title,
        content: updateCardDto.content,
        order: updateCardDto.order,
        column: updateCardDto.columnId ? {
          connect: { id: updateCardDto.columnId }
        } : undefined,
        user: updateCardDto.userId ? {
          connect: { id: updateCardDto.userId }
        } : undefined
      },
      include: {
        user: true,
        column: true
      }
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
        column: {
          connect: { id: columnId }
        },
        order
      },
      include: {
        user: true,
        column: true
      }
    });
  }

  async reorderCards(cards: { id: string; order: number }[]) {
    const updates = cards.map(({ id, order }) =>
      this.prisma.card.update({
        where: { id },
        data: { order },
        include: {
          user: true,
          column: true
        }
      })
    );
    return this.prisma.$transaction(updates);
  }
}