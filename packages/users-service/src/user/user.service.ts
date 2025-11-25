import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} does not exist or has been deleted.`);
    }

    return user;
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

    return `User with ID ${id} has been soft-deleted.`;
  }
}