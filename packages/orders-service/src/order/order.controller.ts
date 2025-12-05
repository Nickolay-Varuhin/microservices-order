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
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(Number(id));
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateStatus(Number(id), updateOrderDto.status);
  }

 
  @Patch('user/:userId/cancel')
  async cancelOrdersByUserId(@Param('userId') userId: string): Promise<string> {
    return this.orderService.cancelOrdersByUserId(Number(userId));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.orderService.delete(Number(id));
  }

  @Delete('by-user/:userId')
  deleteByUser(@Param('userId') userId: string) {
  return this.orderService.deleteByUserId(+userId);
  }

  @Delete('by-product/:productId')
  deleteByProduct(@Param('productId') productId: string) {
  return this.orderService.deleteByProductId(+productId);
  }


  @Post('seed')
  async seed(): Promise<string> {
    return this.orderService.seedOrders();
  }
}