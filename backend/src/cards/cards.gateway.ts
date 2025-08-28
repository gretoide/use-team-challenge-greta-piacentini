import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CardsGateway {
  constructor(private readonly cardsService: CardsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createCard')
  async handleCreateCard(
    @MessageBody() createCardDto: CreateCardDto,
  ) {
    try {
      const card = await this.cardsService.create(createCardDto);
      // Asegurarnos de que el userId se envía en el evento
      this.server.emit('cardCreated', { 
        ...card,
        userId: createCardDto.userId
      });
      return { success: true, data: card };
    } catch (error) {
      return { success: false, error: 'Error al crear la tarjeta: ' + error.message };
    }
  }

  @SubscribeMessage('updateCard')
  async handleUpdateCard(
    @MessageBody() data: { id: string } & UpdateCardDto,
  ) {
    try {
      const { id, ...updateData } = data;
      const card = await this.cardsService.update(id, updateData);
      this.server.emit('cardUpdated', { ...card, userId: card.userId });
      return { success: true, data: card };
    } catch (error) {
      return { success: false, error: 'Error al actualizar la tarjeta: ' + error.message };
    }
  }

  @SubscribeMessage('deleteCard')
  async handleDeleteCard(
    @MessageBody() data: { id: string },
  ) {
    try {
      const card = await this.cardsService.findOne(data.id);
      if (!card) {
        throw new Error('Tarjeta no encontrada');
      }
      await this.cardsService.remove(data.id);
      this.server.emit('cardDeleted', { id: data.id, userId: card.userId });
      return { success: true, data: { id: data.id, userId: card.userId } };
    } catch (error) {
      return { success: false, error: 'Error al eliminar la tarjeta: ' + error.message };
    }
  }

  @SubscribeMessage('moveCard')
  async handleMoveCard(
    @MessageBody() data: { id: string; columnId: string; order: number },
  ) {
    try {
      const card = await this.cardsService.moveCard(data.id, data.columnId, data.order);
      this.server.emit('cardMoved', { ...data, userId: card.userId });
      return { success: true, data: card };
    } catch (error) {
      return { success: false, error: 'Error al mover la tarjeta: ' + error.message };
    }
  }

  @SubscribeMessage('getCards')
  async handleGetCards(
    @MessageBody() columnId: string,
  ) {
    try {
      const cards = await this.cardsService.findAll(columnId);
      return { success: true, data: cards };
    } catch (error) {
      return { success: false, error: 'Error al obtener las tarjetas: ' + error.message };
    }
  }
}