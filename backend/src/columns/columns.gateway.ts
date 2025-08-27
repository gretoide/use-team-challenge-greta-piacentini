import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnsService } from './columns.service';

@WebSocketGateway({
  cors: {
    origin: '*', // En producción, configura esto con tu dominio específico
  },
})
export class ColumnsGateway {
  constructor(private readonly columnsService: ColumnsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createColumn')
  async handleCreateColumn(
    @MessageBody() createColumnDto: CreateColumnDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const column = await this.columnsService.create(createColumnDto);
      // Emitir el evento a todos los clientes conectados
      this.server.emit('columnCreated', column);
      return { success: true, data: column };
    } catch (error) {
      client.emit('error', { message: 'Error al crear la columna' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('updateColumn')
  async handleUpdateColumn(
    @MessageBody() updateColumnDto: UpdateColumnDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const column = await this.columnsService.update(updateColumnDto.id, updateColumnDto);
      this.server.emit('columnUpdated', column);
      return { success: true, data: column };
    } catch (error) {
      client.emit('error', { message: 'Error al actualizar la columna' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('deleteColumn')
  async handleDeleteColumn(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.columnsService.remove(id);
      this.server.emit('columnDeleted', id);
      return { success: true };
    } catch (error) {
      client.emit('error', { message: 'Error al eliminar la columna' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('reorderColumns')
  async handleReorderColumns(
    @MessageBody() columns: { id: string; order: number }[],
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.columnsService.reorder(columns);
      this.server.emit('columnsReordered', columns);
      return { success: true };
    } catch (error) {
      client.emit('error', { message: 'Error al reordenar las columnas' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getColumns')
  async handleGetColumns(
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('🔍 Solicitando columnas...');
      const columns = await this.columnsService.findAll();
      console.log('📋 Columnas encontradas:', columns.length);
      console.log('📋 Datos:', JSON.stringify(columns, null, 2));
      return { success: true, data: columns };
    } catch (error) {
      console.error('❌ Error al obtener columnas:', error);
      client.emit('error', { message: 'Error al obtener las columnas' });
      return { success: false, error: error.message };
    }
  }
}