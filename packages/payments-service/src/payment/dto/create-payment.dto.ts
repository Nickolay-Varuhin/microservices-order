import { IsNumber, IsString, IsEnum, Min, IsOptional } from 'class-validator';

enum PaymentStatus {
  pending = 'pending',
  paid = 'paid',
  failed = 'failed',
}

export class CreatePaymentDto {
  @IsNumber({}, { message: 'orderId must be a number.' })
  @Min(1, { message: 'orderId must be greater than 0.' })
  orderId: number;

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Status must be one of: pending, paid, failed.' })
  status?: string;
}