import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private db: PrismaService) {}
  async create(body: CreateEmployeeDto) {
    const checkExistPhoneNumber = await this.db.seller.findFirst({
      where: { phone_number: body?.phone_number },
    });
    if (checkExistPhoneNumber) {
      throw new ConflictException(
        'Для создания продавца используйте уникальный номер телефона',
      );
    }
    const seller = await this.db.seller.create({
      data: { ...body },
    });

    return seller;
  }

  async findAll() {
    const sellers = await this.db.seller.findMany();
    return sellers;
  }

  async findOne(id: number) {
    const seller = await this.db.seller.findFirst({
      where: { seller_code: id },
    });
    return seller;
  }

  async update(id: number, body: UpdateEmployeeDto) {
    const updatedSeller = await this.db.seller.update({
      where: { seller_code: id },
      data: { ...body },
    });
    if (!updatedSeller) {
      throw new NotFoundException('Продавец не найден');
    }
    return updatedSeller;
  }

  async remove(id: number) {
    const seller = await this.db.seller.findUnique({
      where: { seller_code: id },
      include: { order: true },
    });

    if (seller) {
      if (seller.order.length > 0) {
        throw new ConflictException(
          `Продавец ${
            seller.surname + ' ' + seller.name
          } имеет активные заказы. Его нельзя удалить. (Сначала удалите заказы связанные с этим продавцом)`,
        );
      }

      const deletedSeller = await this.db.seller.delete({
        where: { seller_code: id },
      });
      return `Продавец ${
        deletedSeller.surname + ' ' + deletedSeller.name
      } успешно удален, и заказы, связанные с ним, также удалены.`;
    }

    throw new NotFoundException(`Продавец ${id} не найден.`);
  }
}
