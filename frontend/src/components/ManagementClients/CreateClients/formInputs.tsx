import { DatePicker, Input } from "antd";
import locale from "antd/es/date-picker/locale/en_US";
import { Rule } from "antd/es/form";
import InputMask from "react-input-mask";

export const formInputs = [
  {
    label: "Фамилия",
    name: "surname",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите фамилию клиента!",
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
        message: "Пожалуйста, введите имя клиента!",
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
        message: "Пожалуйста, введите отчество клиента!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Адрес",
    name: "address",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите адрес клиента!",
      },
    ] as Rule[],
    node: <Input />,
  },
  {
    label: "Email",
    name: "email",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите почту клиента!",
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
        message: "Пожалуйста, введите номер телефона клиента!",
      },
    ] as Rule[],
    node: (
      <InputMask mask="+7 (999) 999-99-99" maskChar="_">
        {(inputProps) => <Input {...inputProps} />}
      </InputMask>
    ),
  },
];
