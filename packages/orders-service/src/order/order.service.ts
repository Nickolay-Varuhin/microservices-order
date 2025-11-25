import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    // Проверяем, существует ли пользователь
    try {
      await lastValueFrom(this.http.get(`http://users-service:3000/users/${createOrderDto.userId}`));
    } catch (error) {
      throw new Error(`User with ID ${createOrderDto.userId} does not exist.`);
    }

    // Проверяем, существует ли товар
    try {
      await lastValueFrom(this.http.get(`http://products-service:3000/products/${createOrderDto.productId}`));
    } catch (error) {
      throw new Error(`Product with ID ${createOrderDto.productId} does not exist.`);
    }

    const order = await this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        productId: createOrderDto.productId,
        status: 'created',
      },
    });

    // Создаём платеж
    await lastValueFrom(
      this.http.post('http://payments-service:3000/payments', {
        orderId: order.id,
        status: 'pending',
      }),
    );

    return order;
  }

  async findAll(): Promise<any[]> {
    return this.prisma.order.findMany();
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number, status: string): Promise<any> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  // отменить заказы пользователя
  async cancelOrdersByUserId(userId: number): Promise<string> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
    });

    for (const order of orders) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'cancelled_by_user_deletion' },
      });
      try {
        await lastValueFrom(
          this.http.patch(`http://payments-service:3000/payments/order/${order.id}/cancel`, {}),
        );
      } catch (error) {
        console.error('Could not notify payments-service:', error);
      }
    }

    return `Cancelled ${orders.length} orders for user ID ${userId}.`;
  }

  async delete(id: number): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new Error(`Order with ID ${id} does not exist.`);
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return `Order with ID ${id} has been deleted.`;
  }

  async seedOrders(): Promise<string> {
    // Получаем список пользователей
    const usersRes = await lastValueFrom(
      this.http.get('http://users-service:3000/users'),
    );
    const users = usersRes.data;

    // Получаем список товаров
    const productsRes = await lastValueFrom(
      this.http.get('http://products-service:3000/products'),
    );
    const products = productsRes.data;

    if (users.length === 0 || products.length === 0) {
      throw new Error('No users or products found. Please seed users and products first.');
    }

    const orders = [
      { userId: users[0].id, productId: products[0].id },
      { userId: users[1]?.id || users[0].id, productId: products[1]?.id || products[0].id },
      { userId: users[2]?.id || users[0].id, productId: products[2]?.id || products[0].id },
    ];

    for (const order of orders) {
      await this.create({ userId: order.userId, productId: order.productId });
    }

    return 'Test orders seeded';
  }
}