/*
  Warnings:

  - You are about to drop the column `birthday` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `passport_data` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `workplace` on the `client` table. All the data in the column will be lost.
  - You are about to drop the `contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_client_code_fkey";

-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_credit_code_fkey";

-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_employee_code_fkey";

-- DropIndex
DROP INDEX "client_passport_data_key";

-- AlterTable
ALTER TABLE "client" DROP COLUMN "birthday",
DROP COLUMN "passport_data",
DROP COLUMN "salary",
DROP COLUMN "workplace",
ADD COLUMN     "email" VARCHAR(255),
ALTER COLUMN "surname" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lastname" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "contract";

-- DropTable
DROP TABLE "credit";

-- DropTable
DROP TABLE "employee";

-- CreateTable
CREATE TABLE "seller" (
    "seller_code" SERIAL NOT NULL,
    "surname" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "phone_number" VARCHAR(20),

    CONSTRAINT "seller_pkey" PRIMARY KEY ("seller_code")
);

-- CreateTable
CREATE TABLE "product" (
    "product_code" SERIAL NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "max_amount" DECIMAL(10,2) NOT NULL,
    "quanity" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_code")
);

-- CreateTable
CREATE TABLE "order" (
    "order_code" SERIAL NOT NULL,
    "client_code" INTEGER,
    "seller_code" INTEGER,
    "product_code" INTEGER,
    "order_amount" DECIMAL(10,2) NOT NULL,
    "monthly_payment" DECIMAL(10,2) NOT NULL,
    "order_date" DATE DEFAULT CURRENT_DATE,
    "delivery_date" DATE,
    "delivery_method" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "payment_status" VARCHAR(50) NOT NULL,
    "quanity" INTEGER NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("order_code")
);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_client_code_fkey" FOREIGN KEY ("client_code") REFERENCES "client"("client_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_seller_code_fkey" FOREIGN KEY ("seller_code") REFERENCES "seller"("seller_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_product_code_fkey" FOREIGN KEY ("product_code") REFERENCES "product"("product_code") ON DELETE NO ACTION ON UPDATE NO ACTION;
