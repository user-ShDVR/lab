import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Иван' })
  @IsString()
  @Length(2, 50, { message: 'Длина должна быть от 2 до 50 символов' })
  surname: string;
  @ApiProperty({ example: 'Иванов' })
  @IsString()
  @Length(2, 50, { message: 'Длина должна быть от 2 до 50 символов' })
  name: string;
  @ApiProperty({ example: 'Иванович' })
  @IsString()
  @Length(2, 50, { message: 'Длина должна быть от 2 до 50 символов' })
  lastname: string;
  @ApiProperty({ example: 'ivan.ivanov@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'ул. Пушкина, д.1' })
  @IsString()
  address: string;
  @ApiProperty({ example: '(982)736-45-93' })
  @IsString()
  phone_number?: string;
}
