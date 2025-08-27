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

    console.log('🔍 IDs de columnas:', columns.map(c => c.id));

    // Obtener TODAS las tarjetas primero
    const allCards = await this.prisma.card.findMany({
      orderBy: { order: 'asc' }
    });

    console.log('🃏 Todas las tarjetas:', allCards.map(card => ({
      id: card.id,
      title: card.title,
      columnId: card.columnId
    })));

    // Agrupar tarjetas por columna
    const columnsWithCards = columns.map(column => {
      const cards = allCards.filter(card => card.columnId === column.id);
      
      console.log(`🔍 Tarjetas para columna ${column.title} (${column.id}):`, 
        cards.map(card => ({
          id: card.id, 
          title: card.title, 
          columnId: card.columnId
        }))
      );

      return { 
        ...column, 
        cards 
      };
    });

    console.log('🔍 Columnas con tarjetas:', JSON.stringify(columnsWithCards, null, 2));

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

    // Luego eliminar la columna
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