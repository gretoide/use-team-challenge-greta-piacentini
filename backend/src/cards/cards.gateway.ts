import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // En producción, configura esto con tu dominio específico
  },
})
export class CardsGateway {
  constructor(private readonly cardsService: CardsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createCard')
  async handleCreateCard(
    @MessageBody() createCardDto: CreateCardDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const card = await this.cardsService.create(createCardDto);
      // Emitir el evento a todos los clientes conectados
      this.server.emit('cardCreated', card);
      return { success: true, data: card };
    } catch (error) {
      client.emit('error', { message: 'Error al crear la tarjeta' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('updateCard')
  async handleUpdateCard(
    @MessageBody() updateCardDto: UpdateCardDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const card = await this.cardsService.update(updateCardDto.id, updateCardDto);
      this.server.emit('cardUpdated', card);
      return { success: true, data: card };
    } catch (error) {
      client.emit('error', { message: 'Error al actualizar la tarjeta' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('deleteCard')
  async handleDeleteCard(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.cardsService.remove(id);
      this.server.emit('cardDeleted', id);
      return { success: true };
    } catch (error) {
      client.emit('error', { message: 'Error al eliminar la tarjeta' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('moveCard')
  async handleMoveCard(
    @MessageBody() data: { 
      id: string; 
      columnId: string; 
      order: number 
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Mover la tarjeta a la nueva columna
      const movedCard = await this.cardsService.moveCard(
        data.id, 
        data.columnId, 
        data.order
      );

      // Emitir evento a todos los clientes (el frontend ya manejará el estado)
      this.server.emit('cardMoved', {
        id: data.id,
        columnId: data.columnId,
        order: data.order
      });

      return { 
        success: true, 
        data: movedCard 
      };
    } catch (error) {
      client.emit('error', { 
        message: 'Error al mover la tarjeta', 
        error: error.message 
      });
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  @SubscribeMessage('reorderCards')
  async handleReorderCards(
    @MessageBody() data: { 
      columnId: string; 
      cards: { id: string; order: number }[] 
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Reordenar tarjetas en la columna
      const reorderedCards = await this.cardsService.reorderCardsInColumn(
        data.columnId, 
        data.cards
      );

      // Emitir evento a todos los clientes
      this.server.emit('cardsReordered', {
        columnId: data.columnId,
        cards: data.cards
      });

      return { 
        success: true, 
        data: reorderedCards 
      };
    } catch (error) {
      client.emit('error', { 
        message: 'Error al reordenar tarjetas', 
        error: error.message 
      });
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  @SubscribeMessage('getCards')
  async handleGetCards(
    @MessageBody() columnId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const cards = await this.cardsService.findAll(columnId);
      return { success: true, data: cards };
    } catch (error) {
      client.emit('error', { message: 'Error al obtener las tarjetas' });
      return { success: false, error: error.message };
    }
  }
}
