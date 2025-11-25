import { Module } from '@nestjs/common';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { PrismaService } from './prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class AppModule {}