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

  async moveCard(cardId: string, newColumnId: string, newOrder: number) {
    try {
      // 1. Obtener la tarjeta y verificar que existe
      const card = await this.prisma.card.findUnique({
        where: { id: cardId }
      });

      if (!card) throw new Error('Tarjeta no encontrada');

      // 2. Mover todas las tarjetas en una sola transacción
      await this.prisma.$transaction(async (prisma) => {
        // 2.1 Mover las tarjetas en la columna destino para hacer espacio
        await prisma.card.updateMany({
          where: {
            columnId: newColumnId,
            order: {
              gte: newOrder
            }
          },
          data: {
            order: {
              increment: 1
            }
          }
        });

        // 2.2 Mover la tarjeta a su nueva posición
        await prisma.card.update({
          where: { id: cardId },
          data: {
            columnId: newColumnId,
            order: newOrder
          }
        });

        // 2.3 Reordenar las tarjetas en la columna origen
        const sourceCards = await prisma.card.findMany({
          where: { 
            columnId: card.columnId,
            id: { not: cardId }
          },
          orderBy: { order: 'asc' }
        });

        // Actualizar el orden de las tarjetas restantes
        for (const [index, card] of sourceCards.entries()) {
          await prisma.card.update({
            where: { id: card.id },
            data: { order: index }
          });
        }
      }, {
        timeout: 10000 // 10 segundos de timeout para la transacción
      });

      // Retornar la tarjeta actualizada
    return this.prisma.card.findUnique({
      where: { id: cardId }
    });
    } catch (error) {
      console.error('Error al mover la tarjeta:', error);
      throw error;
    }
  }

  async reorderCardsInColumn(columnId: string, cardUpdates: { id: string; order: number }[]) {
    // Actualizar el orden de las tarjetas en una columna
    const updates = cardUpdates.map(update => 
      this.prisma.card.update({
        where: { id: update.id },
        data: { 
          order: update.order,
          columnId: columnId  // Asegurar que la tarjeta pertenezca a la columna correcta
        }
      })
    );

    return Promise.all(updates);
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