import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs'; 

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private httpService: HttpService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
      },
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }


  async delete(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} does not exist.`);
    }

    if (user.deletedAt) {
      throw new ConflictException(`User with ID ${id} is already deleted.`);
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    try {
      await firstValueFrom(
        this.httpService.delete(
          'http://orders-service:3000/orders/by-user/' + id,
        ),
      );
    } catch (e) {
      // опционально: залогировать, но не ронять удаление пользователя
      // console.error('Failed to delete user orders', e);
    }

    return `User with ID ${id} has been soft-deleted.`;
  }
}