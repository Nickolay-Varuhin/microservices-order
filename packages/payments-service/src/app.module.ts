import { Module } from '@nestjs/common';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { PrismaService } from './prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
})
export class AppModule {}