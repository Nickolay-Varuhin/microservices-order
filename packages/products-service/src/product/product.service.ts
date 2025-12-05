import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<any> {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
      },
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async delete(id: number): Promise<string> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} does not exist.`);
    }

    if (product.deletedAt) {
      throw new ConflictException(`Product with ID ${id} is already deleted.`);
    }

    // 1) мягко удаляем продукт
    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // 2) удаляем все заказы с этим продуктом в orders-service
    try {
      await firstValueFrom(
        this.httpService.delete(
          'http://orders-service:3000/orders/by-product/' + id,
        ),
      );
    } catch (e) {
      // можно залогировать, но не ломать удаление продукта
      // console.error('Failed to delete product orders', e);
    }

    return `Product with ID ${id} has been soft-deleted.`;
  }
}
