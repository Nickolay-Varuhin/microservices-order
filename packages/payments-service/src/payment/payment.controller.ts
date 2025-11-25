import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.updateStatus(id, updatePaymentDto.status);
  }

  @Post('seed')
  async seed(): Promise<string> {
    return this.paymentService.seedPayments();
  }
}