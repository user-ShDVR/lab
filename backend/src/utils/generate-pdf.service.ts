import { Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";
import * as fs from "fs";
import * as path from "path";
import * as PDFDocument from "pdfkit";

interface IContractData {
  order_code: number,
  client_code: number,
  seller_code: number,
  product_code: number,
  order_amount: Decimal,
  quanity: number,
  delivery_date: Date,
  order_date: Date,
  status: string,
  delivery_method: string,
  product: {
    product_code: number;
    product_name: string;
    price: Decimal;
    quanity: number;
  };
  seller: {
    seller_code: number;
    surname: string;
    name: string;
    lastname: string;
    email: string;
    phone_number: string;
  };
  clients: {
    client_code: number;
    surname: string;
    name: string;
    lastname: string;
    email: string;
    phone_number: string;
    address: string;
  };
}

@Injectable()
export class GeneratePdfService {
  async generatePDF(contractData: IContractData): Promise<string> {
    const doc = new PDFDocument();
    const filename = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      `${contractData.order_code}.pdf`
    );
    const stream = fs.createWriteStream(filename);

    doc.pipe(stream);
    const fontPath = path.join(__dirname, "..", "..", "fonts", "arial.ttf");
    doc.font(fontPath);

    doc
      .fontSize(14)
      .text("Чек:", { align: "center", lineGap: 20 });

    // Выводим основные данные контракта
    doc.fontSize(12).text(`Код заказа: ${contractData.order_code}`);
    doc.fontSize(12).text(`Сумма заказа: ${contractData.order_amount}₽`);

      doc
      .fontSize(12)
      .text(`Наименование купленного продукта: ${contractData.product.product_name}`);
      doc
      .fontSize(12)
      .text(`Количество продуктов заказа: ${contractData.quanity}`);
      doc
      .fontSize(12)
      .text(`Дата заказа: ${contractData.order_date}`);
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(filename));
      stream.on("error", reject);
    });
  }
}
