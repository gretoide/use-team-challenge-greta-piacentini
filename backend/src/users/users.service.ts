import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        cards: true,
        boardUsers: {
          include: {
            board: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        boardUsers: {
          include: {
            board: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        cards: true,
        boardUsers: {
          include: {
            board: true
          }
        }
      }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        boardUsers: {
          include: {
            board: true
          }
        }
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email
      },
      include: {
        cards: true,
        boardUsers: {
          include: {
            board: true
          }
        }
      }
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async addToBoard(userId: string, boardId: string) {
    return this.prisma.boardUser.create({
      data: {
        user: { connect: { id: userId } },
        board: { connect: { id: boardId } }
      },
      include: {
        user: true,
        board: true
      }
    });
  }

  async removeFromBoard(userId: string, boardId: string) {
    return this.prisma.boardUser.delete({
      where: {
        userId_boardId: {
          userId,
          boardId
        }
      }
    });
  }
}