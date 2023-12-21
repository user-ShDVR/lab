import { DatePicker, Input, Select } from "antd";
import { Rule, RuleObject } from "antd/es/form";
import {
  useGetAllClientsQuery,
  useGetAllEmployeesQuery,
  useGetAllPledgesQuery,
} from "../../../store/api";
import { CreateForm } from "../../../styles/createFormsStyles";
import { IEmployee } from "../../../store/api/employees/types";
import { IPledge } from "../../../store/api/pledges/types";
import { IClient } from "../../../store/api/clients/types";
import locale from "antd/es/date-picker/locale/ru_RU";

export const FormInputs = ({form}) => {
  const { data: clientsData } = useGetAllClientsQuery();
  const { data: pledgesData } = useGetAllPledgesQuery();
  const { data: employeesData } = useGetAllEmployeesQuery();

  const validateQuantity = (rule: RuleObject, value: any) => {
    const productCode = form.getFieldValue("product_code");
    const selectedProduct = pledgesData?.find((pledge: IPledge) => pledge.product_code === productCode);

    if (selectedProduct && value > selectedProduct.quanity) {
      return Promise.reject(`Количество не может превышать ${selectedProduct.quanity}`);
    }
    
    return Promise.resolve();
  };
  const formInputs = [
    {
      label: "Дата доставки",
      name: "delivery_date",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите дату доставки!",
        },
      ] as Rule[],
      node: <DatePicker />,
    },
    {
      label: "Метод доставки",
      name: "delivery_method",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите метод доставки!",
        },
      ] as Rule[],
      node: <Input />,
    },
    {
      label: "Статус заказа",
      name: "status",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите статус заказа!",
        },
      ] as Rule[],
      node: <Input />,
    },
    {
      label: "Клиент",
      name: "client_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, выберите клиента!",
        },
      ] as Rule[],
      options: clientsData?.map((client: IClient) => ({
        label: `${client.surname} ${client.name} ${client.lastname}`,
        value: client.client_code,
      })),
      node: (
        <Select>
          {clientsData?.map((client: IClient) => (
            <Select.Option key={client.client_code} value={client.client_code}>
              {client.surname} {client.name} {client.lastname}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: "Продукт",
      name: "product_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, выберите продукт",
        },
      ] as Rule[],
      options: pledgesData?.map((pledge: IPledge) => ({
        label: pledge.product_name,
        value: pledge.product_code,
      })),
      node: (
        <Select>
          {pledgesData?.map((pledge: IPledge) => (
            <Select.Option key={pledge.product_code} value={pledge.product_code}>
              {'1 ' +pledge.product_name + ' стоит ' + pledge.price + ' Руб.'}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: "Количество продукта",
      name: "quanity",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите количество продукта!",
        },
        {
          validator: validateQuantity, // Используем валидатор для ограничения количества
        },
      ] as Rule[],
      node: <Input />,
    },
    {
      label: "Продавец",
      name: "seller_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, выберите продавца!",
        },
      ] as Rule[],
      options: employeesData?.map((employee: IEmployee) => ({
        label: employee.surname,
        value: employee.seller_code,
      })),
      node: (
        <Select>
          {employeesData?.map((employee: IEmployee) => (
            <Select.Option
              key={employee.seller_code}
              value={employee.seller_code}
            >
              {employee.surname} {employee.name} {employee.lastname}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return formInputs.map((input) => (
    <CreateForm.Item {...input} key={input.name}>
      {input.node}
    </CreateForm.Item>
  ));
};
