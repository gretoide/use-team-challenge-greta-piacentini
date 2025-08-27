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

    // Obtener TODAS las tarjetas primero
    const allCards = await this.prisma.card.findMany({
      orderBy: { order: 'asc' }
    });

    // Obtener todos los usuarios
    const allUsers = await this.prisma.user.findMany();

    // Agrupar tarjetas por columna con información de usuarios
    const columnsWithCards = columns.map(column => {
      const cards = allCards
        .filter(card => card.columnId === column.id)
        .map(card => {
          const user = allUsers.find(u => u.id === card.userId);
          return {
            ...card,
            userName: user ? user.name : 'Usuario desconocido'
          };
        });

      return { 
        ...column, 
        cards 
      };
    });

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