import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get('system-id')
  getSystemId() {
    return { systemId: process.env.SYSTEM_ID || 'orders-service' };
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAllFiltered();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOneFiltered(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.orderService.delete(Number(id));
  }

  @Post('seed')
  async seed(): Promise<string> {
    return this.orderService.seedOrders();
  }
}