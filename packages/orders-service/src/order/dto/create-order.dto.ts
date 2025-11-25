import { IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber({}, { message: 'userId must be a number.' })
  @Min(1, { message: 'userId must be greater than 0.' })
  userId: number;

  @IsNumber({}, { message: 'productId must be a number.' })
  @Min(1, { message: 'productId must be greater than 0.' })
  productId: number;
}