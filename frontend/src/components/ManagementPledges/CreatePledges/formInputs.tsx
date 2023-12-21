import { Input } from "antd";
import { Rule } from "antd/es/form";

export const formInputs = [
  {
    label: "Название продукта",
    name: "product_name",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите название продукта!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Цена товара",
    name: "price",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите цену одного товара!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Количество товаров",
    name: "quanity",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите максимальное количество товаров!",
      },
    ] as Rule[],
    node: <Input />,
  },
];
