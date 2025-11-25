import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<any> {
    // Проверяем, существует ли заказ
    try {
      await lastValueFrom(this.http.get(`http://orders-service:3000/orders/${createPaymentDto.orderId}`));
    } catch (error) {
      throw new Error(`Order with ID ${createPaymentDto.orderId} does not exist.`);
    }

    return this.prisma.payment.create({
      data: {
        orderId: createPaymentDto.orderId,
        status: createPaymentDto.status || 'pending',
      },
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.payment.findMany();
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number, status: string): Promise<any> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status },
    });

    if (status === 'paid') {
      // Обновляем статус заказа
      await lastValueFrom(
        this.http.patch(`http://orders-service:3000/orders/${payment.orderId}/status`, {
          status: 'paid',
        }),
      );
    }

    return payment;
  }

  async cancelPaymentByOrderId(orderId: number): Promise<string> {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId },
    });

    if (!payment) {
      return `No payment found for order ID ${orderId}.`;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'cancelled_by_user_deletion' }, 
    });

    return `Payment for order ID ${orderId} has been cancelled.`;
  }

  async delete(id: number): Promise<string> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new Error(`Payment with ID ${id} does not exist.`);
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return `Payment with ID ${id} has been deleted.`;
  }

  async seedPayments(): Promise<string> {
    // Получаем список заказов
    const ordersRes = await lastValueFrom(
      this.http.get('http://orders-service:3000/orders'),
    );
    const orders = ordersRes.data;

    if (orders.length === 0) {
      throw new Error('No orders found. Please seed orders first.');
    }

    const payments = [
      { orderId: orders[0].id, status: 'pending' },
      { orderId: orders[1]?.id || orders[0].id, status: 'paid' },
      { orderId: orders[2]?.id || orders[0].id, status: 'failed' },
    ];

    for (const payment of payments) {
      await this.create({ orderId: payment.orderId, status: payment.status });
    }

    return 'Test payments seeded';
  }
}