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
      },
    });
  }

  async findAll() {
    const columns = await this.prisma.column.findMany({
      orderBy: { order: 'asc' }
    });

    // Obtener las tarjetas para cada columna
    const columnsWithCards = await Promise.all(
      columns.map(async (column) => {
        const cards = await this.prisma.card.findMany({
          where: { columnId: column.id },
          orderBy: { order: 'asc' }
        });
        return { ...column, cards };
      })
    );

    return columnsWithCards;
  }

  async update(id: string, updateColumnDto: UpdateColumnDto) {
    return this.prisma.column.update({
      where: { id },
      data: {
        title: updateColumnDto.title,
        order: updateColumnDto.order,
      },
    });
  }

  async remove(id: string) {
    // Primero eliminar todas las tarjetas de la columna
    await this.prisma.card.deleteMany({
      where: { columnId: id }
    });

    return this.prisma.column.delete({
      where: { id },
    });
  }

  async reorder(columns: { id: string; order: number }[]) {
    // Actualizar el orden de una en una para evitar transacciones
    for (const { id, order } of columns) {
      await this.prisma.column.update({
        where: { id },
        data: { order },
      });
    }
    return this.findAll();
  }
}