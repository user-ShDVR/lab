import { DatePicker, Input } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import { Rule } from "antd/es/form";
import InputMask from "react-input-mask";

export const formInputs = [
  {
    label: "Фамилия",
    name: "surname",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите фамилию продавца!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Имя",
    name: "name",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите имя продавца!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Отчество",
    name: "lastname",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите отчество продавца!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Номер телефона",
    name: "phone_number",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите номер телефона продавца!",
      },
    ] as Rule[],
    node: (
      <InputMask mask="+7 (999) 999-99-99" maskChar="_">
        {(inputProps) => <Input {...inputProps} />}
      </InputMask>
    ),
  },
  {
    label: "Email",
    name: "email",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите почту продавца!",
      },
    ] as Rule[],
    node: <Input />,
  },
];
