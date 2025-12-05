import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class AppModule {}