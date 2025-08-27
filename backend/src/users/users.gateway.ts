import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // En producción, configura esto con tu dominio específico
  },
})
export class UsersGateway {
  constructor(private readonly usersService: UsersService) {}

  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, string> = new Map(); // socketId -> userId

  @SubscribeMessage('userConnect')
  async handleUserConnect(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (user) {
        this.connectedUsers.set(client.id, userId);
        this.server.emit('userConnected', { userId, socketId: client.id });
      }
      return { success: true, data: user };
    } catch (error) {
      client.emit('error', { message: 'Error al conectar usuario' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('userDisconnect')
  handleUserDisconnect(@ConnectedSocket() client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.server.emit('userDisconnected', { userId, socketId: client.id });
    }
    return { success: true };
  }

  @SubscribeMessage('createUser')
  async handleCreateUser(
    @MessageBody() createUserDto: CreateUserDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.usersService.create(createUserDto);
      this.server.emit('userCreated', user);
      return { success: true, data: user };
    } catch (error) {
      client.emit('error', { message: 'Error al crear usuario' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('updateUser')
  async handleUpdateUser(
    @MessageBody() updateUserDto: UpdateUserDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.usersService.update(updateUserDto.id, updateUserDto);
      this.server.emit('userUpdated', user);
      return { success: true, data: user };
    } catch (error) {
      client.emit('error', { message: 'Error al actualizar usuario' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('deleteUser')
  async handleDeleteUser(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.usersService.remove(id);
      this.server.emit('userDeleted', id);
      return { success: true };
    } catch (error) {
      client.emit('error', { message: 'Error al eliminar usuario' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getUsers')
  async handleGetUsers(@ConnectedSocket() client: Socket) {
    try {
      const users = await this.usersService.findAll();
      return { success: true, data: users };
    } catch (error) {
      client.emit('error', { message: 'Error al obtener usuarios' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getUser')
  async handleGetUser(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.usersService.findOne(id);
      return { success: true, data: user };
    } catch (error) {
      client.emit('error', { message: 'Error al obtener usuario' });
      return { success: false, error: error.message };
    }
  }
}