import { DatePicker, Input, Select } from "antd";
import { Rule } from "antd/es/form";
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

export const FormInputs = () => {
  const { data: clientsData } = useGetAllClientsQuery();
  const { data: pledgesData } = useGetAllPledgesQuery();
  const { data: employeesData } = useGetAllEmployeesQuery();

  const formInputs = [
    {
      label: "Сумма кредита",
      name: "contract_amount",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите сумму кредита!",
        },
      ] as Rule[],
      node: <Input />,
    },
    {
      label: "Срок кредитования (в месяцах)",
      name: "contract_term",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите срок кредитования в месяцах",
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
          message: "Пожалуйста, введите клиента!",
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
      label: "Имя кредита",
      name: "credit_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите имя кредита!",
        },
      ] as Rule[],
      options: pledgesData?.map((pledge: IPledge) => ({
        label: pledge.credit_name,
        value: pledge.credit_code,
      })),
      node: (
        <Select>
          {pledgesData?.map((pledge: IPledge) => (
            <Select.Option key={pledge.credit_code} value={pledge.credit_code}>
              {pledge.credit_name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: "Сотрудник",
      name: "employee_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите сотрудника!",
        },
      ] as Rule[],
      options: employeesData?.map((employee: IEmployee) => ({
        label: employee.surname,
        value: employee.employee_code,
      })),
      node: (
        <Select>
          {employeesData?.map((employee: IEmployee) => (
            <Select.Option
              key={employee.employee_code}
              value={employee.employee_code}
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
