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

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateStatus(id, updateOrderDto.status);
  }

 
  @Patch('user/:userId/cancel')
  async cancelOrdersByUserId(@Param('userId') userId: number): Promise<string> {
    return this.orderService.cancelOrdersByUserId(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.orderService.delete(id);
  }

  @Post('seed')
  async seed(): Promise<string> {
    return this.orderService.seedOrders();
  }
}