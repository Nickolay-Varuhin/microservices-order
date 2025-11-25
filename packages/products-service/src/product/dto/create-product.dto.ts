import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with at most 2 decimal places.' },
  )
  @Min(0, { message: 'Price must be greater than or equal to 0.' })
  price: number;
}