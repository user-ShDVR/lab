import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private db: PrismaService) {}
  async create(body: CreateClientDto) {
    const checkExistPassport = await this.db.client.findFirst({
      where: { phone_number: body?.phone_number },
    });
    if (checkExistPassport) {
      throw new ConflictException('Клиент с таким номером телефона существует');
    }

    const client = await this.db.client.create({
      data: {...body},
    });

    return client;
  }

  async findAll() {
    const clientsWithOrders = await this.db.client.findMany({
      include: {
        order: {
          select: {
            order_amount: true,
          },
        },
      },
    });

    return clientsWithOrders;
  }

  async findOne(id: number) {
    const client = await this.db.client.findFirst({
      where: { client_code: id },
    });

    if (!client) {
      throw new NotFoundException('Клиент не найден');
    }
    return client;
  }

  async update(id: number, body: UpdateClientDto) {
    const updatedUser = await this.db.client.update({
      where: { client_code: id },
      data: {...body},
    });
    if (!updatedUser) {
      throw new NotFoundException('Клиент не найден');
    }
    return updatedUser;
  }

  async remove(id: number) {
    const client = await this.db.client.findUnique({
      where: { client_code: id },
      include: { order: true },
    });

    if (client) {
      if (client.order.length > 0) {
        throw new ConflictException(
          `Клиент ${
            client.surname + ' ' + client.name
          } имеет активные заказы. Его нельзя удалить. (Сначала удалите заказы связанные с этим клиентом)`,
        );
      }

      const deletedClient = await this.db.client.delete({
        where: { client_code: id },
      });
      return `Клиент ${
        deletedClient.surname + ' ' + deletedClient.name
      } успешно удален, и заказы, связанные с ним, также удалены.`;
    }

    throw new NotFoundException(`Клиент ${id} не найден.`);
  }
}
