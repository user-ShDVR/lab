import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateContractDto {
  @ApiProperty({ example: 1 })
  client_code: number;

  @ApiProperty({ example: 1 })
  seller_code: number;

  @ApiProperty({ example: 1 })
  product_code: number;

  @ApiProperty({ example: 'Собирается' })
  status: string;

  @ApiProperty({ example: 'Самовывоз' })
  delivery_method: string;

  @ApiProperty({ example: '2023-12-31' })
  delivery_date: string;

  @ApiProperty({ example: 1 })
  quanity: number;
}
