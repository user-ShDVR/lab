import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from 'src/utils/prisma.service';
import { GeneratePdfService } from 'src/utils/generate-pdf.service';
import { Decimal } from '@prisma/client/runtime/library';
interface ICredit {
  credit_code: number;
  credit_name: string;
  min_amount?: number | null;
  max_amount?: number | null;
  min_credit_term?: number | null;
  max_credit_term?: number | null;
  interest_rate?: number | null;
}
@Injectable()
export class ContractsService {
  constructor(
    private db: PrismaService,
    private genPDF: GeneratePdfService,
  ) {}
  async create(body: CreateContractDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isClient, isProduct, isSeller] = await Promise.all([
      this.checkIfExists(
        'client',
        'client_code',
        body.client_code,
        'Клиент не найден, договор не создан',
      ),
      this.checkIfExists(
        'product',
        'product_code',
        body.product_code,
        'Продукт не найден, договор не создан',
      ),
      this.checkIfExists(
        'seller',
        'seller_code',
        body.seller_code,
        'Продавец не найден, договор не создан',
      ),
    ]);


    
    const productPrice = Number(isProduct.price);

    const amount = productPrice * body.quanity

    const order = await this.db.order.create({
      data: {
        client_code: body.client_code,
        seller_code: body.seller_code,
        product_code: body.product_code,
        order_amount: amount.toString(),
        quanity: body.quanity,
        delivery_date: new Date(body.delivery_date),
        status: body.status,
        delivery_method: body.delivery_method,
      },
      include: {
        clients: true,
        seller: true,
        product: true,
      },
    });
    await this.genPDF.generatePDF(order);

    return order;
  }

  async findAll(startDate: Date, endDate: Date) {
    const orders = await this.db.order.findMany({
      where: {
        order_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return orders;
  }

  async findOne(id: number) {
    const order = await this.db.order.findFirst({
      where: { order_code: id },
    });
    return order;
  }

  async update(id: number, body: UpdateContractDto) {

    const [isClient, isProduct, isSeller] = await Promise.all([
      this.checkIfExists(
        'client',
        'client_code',
        body.client_code,
        'Клиент не найден, договор не создан',
      ),
      this.checkIfExists(
        'product',
        'product_code',
        body.product_code,
        'Продукт не найден, договор не создан',
      ),
      this.checkIfExists(
        'seller',
        'seller_code',
        body.seller_code,
        'Продавец не найден, договор не создан',
      ),
    ]);


    
    const productPrice = Number(isProduct.price);

    const amount = productPrice * body.quanity
    const updatedOrder = await this.db.order.update({
      where: { order_code: id },
      data: {
        client_code: body.client_code,
        seller_code: body.seller_code,
        product_code: body.product_code,
        order_amount: amount.toString(),
        quanity: body.quanity,
        delivery_date: new Date(body.delivery_date),
        status: body.status,
        delivery_method: body.delivery_method,
      },
      include: {
        clients: true,
        seller: true,
        product: true,
      },
    });
    if (!updatedOrder) {
      throw new NotFoundException('Заказ не найден');
    }
    // await this.genPDF.generatePDF(updatedСontract);
    return updatedOrder;
  }

  async remove(id: number) {
    const order = await this.db.order.findUnique({
      where: { order_code: id },
    });

    if (order) {
      const deletedContract = await this.db.order.delete({
        where: { order_code: id },
      });
      return `Заказ №${deletedContract.order_code} успешно удален`;
    }
    return null;
  }
  async checkIfExists(model: string, field, value, errorMessage) {
    const result = await this.db[model].findFirst({
      where: {
        [field]: value,
      },
    });
    if (!result) {
      throw new NotFoundException(errorMessage);
    }
    return result;
  }
}
