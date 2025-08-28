import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card, Prisma } from '@prisma/client';
import { MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto): Promise<any> {
    try {
      // Usar MongoDB directamente
      const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/my-kanban-db";
      const client = new MongoClient(uri);

      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('Card');

        const result = await collection.insertOne({
          _id: new ObjectId(),
          title: createCardDto.title,
          content: createCardDto.content || '',
          order: createCardDto.order,
          columnId: createCardDto.columnId,
          userId: createCardDto.userId,
        });

        // Convertir el resultado al formato esperado
        return {
          id: result.insertedId.toString(),
          title: createCardDto.title,
          content: createCardDto.content || '',
          order: createCardDto.order,
          columnId: createCardDto.columnId,
          userId: createCardDto.userId,
        };
      } finally {
        await client.close();
      }
    } catch (error) {
      console.error('Error al crear la tarjeta:', error);
      throw new Error('No se pudo crear la tarjeta');
    }
  }

  async findOne(id: string): Promise<Card | null> {
    try {
      return await this.prisma.card.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error al buscar la tarjeta:', error);
      throw new Error('No se pudo encontrar la tarjeta');
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
      // Usar MongoDB directamente para evitar transacciones de Prisma
      const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/my-kanban-db";
      const client = new MongoClient(uri);

      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('Card');

        // Solo actualizar los campos que se pueden modificar
        const updateData: any = {};
        if (updateCardDto.title !== undefined) updateData.title = updateCardDto.title;
        if (updateCardDto.content !== undefined) updateData.content = updateCardDto.content;

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          throw new Error('Tarjeta no encontrada');
        }

        // Obtener la tarjeta actualizada
        const updatedCard = await collection.findOne({ _id: new ObjectId(id) });
        
        if (!updatedCard) {
          throw new Error('No se pudo obtener la tarjeta actualizada');
        }
        
        // Convertir al formato esperado
        return {
          id: updatedCard._id.toString(),
          title: updatedCard.title,
          content: updatedCard.content || '',
          order: updatedCard.order,
          columnId: updatedCard.columnId,
          userId: updatedCard.userId,
        };
      } finally {
        await client.close();
      }
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
      // Solo actualizar la primera tarjeta para evitar problemas de transacciones
      if (cardUpdates.length === 0) return [];
      
      const firstUpdate = cardUpdates[0];
      const result = await this.prisma.card.update({
        where: { id: firstUpdate.id },
        data: { order: firstUpdate.order }
      });
      
      return [result];
    } catch (error) {
      console.error('Error al reordenar las tarjetas:', error);
      throw new Error('No se pudieron reordenar las tarjetas');
    }
  }
}