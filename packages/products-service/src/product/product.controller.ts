import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SeedProductDto } from './dto/seed-product.dto';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get('system-id')
      getSystemId() {
        return { systemId: process.env.SYSTEM_ID || 'products-service' };
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.productService.delete(id);
  }

  @Post('seed')
  async seed(): Promise<string> {
    const products: SeedProductDto[] = [
      { name: 'Смартфон', description: 'Современный смартфон', price: 20000 },
      { name: 'Ноутбук', description: 'Игровой ноутбук', price: 80000 },
      { name: 'Мышка', description: 'Игровая мышка', price: 1800 },
    ];

    for (const product of products) {
      await this.productService.create(product);
    }

    return 'Test products seeded';
  }
}