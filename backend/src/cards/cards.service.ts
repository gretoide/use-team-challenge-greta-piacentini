import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card, Prisma } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    try {
      return await this.prisma.card.create({
        data: {
          title: createCardDto.title,
          content: createCardDto.content || '',
          order: createCardDto.order,
          columnId: createCardDto.columnId,
          userId: createCardDto.userId,
        },
      });
    } catch (error) {
      console.error('Error al crear la tarjeta:', error);
      throw new Error('No se pudo crear la tarjeta');
    }
  }

  async findAll(columnId: string): Promise<Card[]> {
    try {
      return await this.prisma.card.findMany({
        where: { columnId },
        orderBy: { order: 'asc' }
      });
    } catch (error) {
      console.error('Error al buscar tarjetas:', error);
      throw new Error('No se pudieron obtener las tarjetas');
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    try {
      // Verificar que la tarjeta existe
      const exists = await this.prisma.card.findUnique({
        where: { id }
      });

      if (!exists) {
        throw new Error('Tarjeta no encontrada');
      }

      // Actualizar solo los campos proporcionados
      const updateData: Prisma.CardUpdateInput = {};
      if (updateCardDto.title !== undefined) updateData.title = updateCardDto.title;
      if (updateCardDto.content !== undefined) updateData.content = updateCardDto.content;

      return await this.prisma.card.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      console.error('Error al actualizar la tarjeta:', error);
      throw new Error('No se pudo actualizar la tarjeta');
    }
  }

  async remove(id: string): Promise<Card> {
    try {
      return await this.prisma.card.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
      throw new Error('No se pudo eliminar la tarjeta');
    }
  }

  async moveCard(cardId: string, newColumnId: string, newOrder: number): Promise<Card> {
    try {
      return await this.prisma.card.update({
        where: { id: cardId },
        data: {
          columnId: newColumnId,
          order: newOrder
        }
      });
    } catch (error) {
      console.error('Error al mover la tarjeta:', error);
      throw new Error('No se pudo mover la tarjeta');
    }
  }

  async reorderCardsInColumn(columnId: string, cardUpdates: { id: string; order: number }[]): Promise<Card[]> {
    try {
      const results: Card[] = [];
      for (const update of cardUpdates) {
        const result = await this.prisma.card.update({
          where: { id: update.id },
          data: { order: update.order }
        });
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Error al reordenar las tarjetas:', error);
      throw new Error('No se pudieron reordenar las tarjetas');
    }
  }
}