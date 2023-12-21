import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateCreditDto {
  @ApiProperty({ example: 'Ноутбук' })
  product_name: string;
  @ApiProperty({ example: 1200.001 })
  price: Decimal;
  @ApiProperty({ example: 20 })
  quanity: number;
}
