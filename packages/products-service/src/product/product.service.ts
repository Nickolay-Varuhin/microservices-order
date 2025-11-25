import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.product.findMany();
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
}