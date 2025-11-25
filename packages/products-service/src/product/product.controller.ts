import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
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