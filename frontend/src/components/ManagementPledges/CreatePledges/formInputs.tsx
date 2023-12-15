import { Input } from "antd";
import { Rule } from "antd/es/form";

export const formInputs = [
  {
    label: "Название кредита",
    name: "credit_name",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите название кредита!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Минимальная сумма кредита",
    name: "min_amount",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите минимальную сумму кредита!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Максимальная сумма кредита",
    name: "max_amount",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите максимальную сумму кредита!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Минимальный срок кредитования",
    name: "min_credit_term",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите минимальный срок кредитования!",
      },
    ] as Rule[],
    node: <Input type="number" />,
  },
  {
    label: "Максимальный срок кредитования",
    name: "max_credit_term",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите максимальный срок кредитования!",
      },
    ] as Rule[],
    node: <Input type="number" />,
  },
  {
    label: "Процентная ставка",
    name: "interest_rate",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите процентную ставку кредита!",
      },
    ] as Rule[],
    node: <Input />,
  },
];
