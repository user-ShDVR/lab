import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Игорь' })
  @IsString()
  @Length(2, 50, { message: 'Длина должна быть от 2 до 50 символов' })
  surname: string;
  @ApiProperty({ example: 'Сидоров' })
  @IsString()
  @Length(2, 50, { message: 'Длина должна быть от 2 до 50 символов' })
  name: string;
  @ApiProperty({ example: 'Владимирович' })
  @IsString()
  @Length(2, 50, { message: 'Длина должна быть от 2 до 50 символов' })
  lastname: string;
  @ApiProperty({ example: 'igor.sidorov@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '(922)771-13-37' })
  @IsString()
  phone_number?: string;
}
