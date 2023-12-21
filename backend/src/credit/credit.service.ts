import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class CreditService {
  constructor(private db: PrismaService) {}
  async create(body: CreateCreditDto) {
    const product = await this.db.product.create({
      data: body,
    });

    return product;
  }

  async findAll() {
    const products = await this.db.product.findMany();
    return products;
  }

  async findOne(id: number) {
    const product = await this.db.product.findFirst({
      where: { product_code: id },
    });
    return product;
  }

  async update(id: number, body: UpdateCreditDto) {
    const updatedProduct = await this.db.product.update({
      where: { product_code: id },
      data: body,
    });
    if (!updatedProduct) {
      throw new NotFoundException('Продукт не найден');
    }
    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.db.product.findUnique({
      where: { product_code: id },
      include: { order: true },
    });

    if (product) {
      if (product.order.length > 0) {
        throw new ConflictException(
          `Продукт ${product.product_name} имеет активные заказы. Его нельзя удалить. (Сначала удалите заказы связанные с этим продуктом)`,
        );
      }

      const deletedProduct = await this.db.product.delete({
        where: { product_code: id },
      });
      return `Продукт ${deletedProduct.product_name} успешно удален.`;
    }

    throw new NotFoundException(`Продукт ${id} не найден.`);
  }
}
