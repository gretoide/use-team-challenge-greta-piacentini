import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(createColumnDto: CreateColumnDto) {
    return this.prisma.column.create({
      data: {
        title: createColumnDto.title,
        order: createColumnDto.order,
        board: createColumnDto.boardId ? {
          connect: { id: createColumnDto.boardId }
        } : undefined
      },
    });
  }

  async findAll(boardId: string) {
    return this.prisma.column.findMany({
      where: { boardId },
      include: {
        cards: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
  }

  async update(id: string, updateColumnDto: UpdateColumnDto) {
    return this.prisma.column.update({
      where: { id },
      data: {
        title: updateColumnDto.title,
        order: updateColumnDto.order,
        board: updateColumnDto.boardId ? {
          connect: { id: updateColumnDto.boardId }
        } : undefined
      },
    });
  }

  async remove(id: string) {
    return this.prisma.column.delete({
      where: { id },
    });
  }

  async reorder(columns: { id: string; order: number }[]) {
    const updates = columns.map(({ id, order }) =>
      this.prisma.column.update({
        where: { id },
        data: { order },
      })
    );
    return this.prisma.$transaction(updates);
  }
}