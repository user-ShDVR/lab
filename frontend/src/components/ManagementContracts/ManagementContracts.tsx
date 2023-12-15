import React, { useState } from "react";
import { Form, Popconfirm, Button, Input } from "antd";
import { EditableCell } from "./EditableCell";
import {
  ActionsTableWrapper,
  ManageButtonsWrapper,
  StyledTableAnt,
} from "../../styles/managementTableStyles";
import {
  useDeleteContractMutation,
  useGetAllContractsQuery,
  useUpdateContractMutation,
} from "../../store/api/contracts/contractsApi";
import { IContract } from "../../store/api/contracts/types";
import { CreateContracts } from "./CreateContracts/CreateContracts";
import {
  useGetAllClientsQuery,
  useGetAllEmployeesQuery,
  useGetAllPledgesQuery,
} from "../../store/api";
import { IClient } from "../../store/api/clients/types";
import { IPledge } from "../../store/api/pledges/types";
import { Link } from "react-router-dom";

export const ManagementContracts = () => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [form] = Form.useForm<IContract>();
  const { data: contractsData, refetch } = useGetAllContractsQuery();
  const { data: clientsData } = useGetAllClientsQuery();
  const { data: pledgesData } = useGetAllPledgesQuery();
  const { data: employeesData } = useGetAllEmployeesQuery();

  const [updateContract, { isLoading: isUpdateLoading }] =
    useUpdateContractMutation();

  const [deleteContract, { isLoading: isDeleteLoading }] =
    useDeleteContractMutation();

  const [editingKey, setEditingKey] = React.useState("");
  const isEditing = (record: IContract) => record.key === editingKey;

  const edit = (record: IContract) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields();
      const newData = [...contractsData];
      const index = newData.findIndex((item) => key === item.contract_code);

      if (index > -1) {
        const item = newData[index];
        await updateContract({ contract_code: item.contract_code, data: row });

        setEditingKey("");
        refetch();
      } else {
        newData.push(row);
        const item = newData[index];

        await updateContract({ contract_code: item.contract_code, data: row });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key: string) => {
    const dataSource = [...contractsData];
    const contractToDelete = dataSource.find(
      (item) => item.contract_code === key
    );

    try {
      await deleteContract(contractToDelete.contract_code.toString());
      await refetch();
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredData = contractsData
    ? contractsData.filter((contract) => {
        const searchRegex = new RegExp(searchValue, "i");
        return (
          searchRegex.test(formatDate(contract.creation_date)) ||
          searchRegex.test(formatDate(contract.termination_date)) ||
          searchRegex.test(formatDate(contract.payment_date)) ||
          searchRegex.test(contract.contract_type) ||
          searchRegex.test(contract.payment_to_client) ||
          (clientsData &&
            searchRegex.test(
              clientsData.find(
                (client) => client.client_code === contract.client_code
              )?.surname
            )) ||
          (pledgesData &&
            searchRegex.test(
              pledgesData.find(
                (pledge) => pledge.credit_code === contract.credit_code
              )?.description
            )) ||
          (employeesData &&
            searchRegex.test(
              employeesData.find(
                (employee) => employee.employee_code === contract.employee_code
              )?.full_name
            ))
        );
      })
    : [];

  const columns = [
    {
      title: "ID",
      dataIndex: "contract_code",
      width: "1%",
      sorter: (a: IContract, b: IContract) => {
        const codeA = a.contract_code?.toString() || "";
        const codeB = b.contract_code?.toString() || "";
        return codeA.localeCompare(codeB);
      },
      sortDirections: ["ascend", "descend"],
    },

    {
      title: "Сумма кредита",
      dataIndex: "contract_amount",
      width: "10%",
      editable: true,
      render: (contract_amount) => `${contract_amount}₽`,
    },
    {
      title: "Срок кредитования (в месяцах)",
      dataIndex: "contract_term",
      width: "10%",
      editable: true,
    },
    {
      title: "Размер ежемесячного платежа",
      dataIndex: "monthly_payment",
      width: "8%",
      editable: true,
      render: (monthly_payment) => `${monthly_payment}₽`,
    },
    {
      title: "Тип кредита",
      dataIndex: "credit_code",
      width: "20%",
      editable: true,
      render: (creditCode: IPledge | number) => {
        const pledge = pledgesData?.find(
          (emp) => emp.credit_code === creditCode
        );
        return pledge?.credit_name || creditCode;
      },
    },
    {
      title: "Сотрудник",
      dataIndex: "employee_code",
      width: "20%",
      editable: true,
      render: (employeeCode: IClient | number) => {
        const employee = employeesData?.find(
          (emp) => emp.employee_code === employeeCode
        );
        return `${employee?.surname} ${employee?.name} ${employee?.lastname}` || employeeCode;
      },
      sorter: (a: IContract, b: IContract) => {
        const aEmployee = employeesData?.find(
          (emp) => emp.employee_code === a.employee_code
        );
        const bEmployee = employeesData?.find(
          (emp) => emp.employee_code === b.employee_code
        );
        return (aEmployee?.full_name || a.employee_code).localeCompare(
          bEmployee?.full_name || b.employee_code
        );
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Действия",
      dataIndex: "operation",
      render: (_: never, record: IContract) => {
        const editable = isEditing(record);

        return editable ? (
          <ActionsTableWrapper>
            <Button
              onClick={() => save(record.key)}
              loading={isUpdateLoading}
              type="primary"
            >
              Сохранить
            </Button>

            <Popconfirm
              title="Уверены что хотите отменить действие?"
              onConfirm={cancel}
            >
              <Button>Отменить</Button>
            </Popconfirm>
          </ActionsTableWrapper>
        ) : (
          <ActionsTableWrapper>
            {/* <Button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              type="primary"
            >
              Изменить
            </Button> */}

            <Popconfirm
              title="Уверены что хотите удалить предмет залога?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button>Удалить</Button>
            </Popconfirm>

            <Button type="primary">
              <Link
                target="_blank"
                to={`http://localhost:3000/uploads/${record.contract_code}.pdf`}
              >
                Экспортировать
              </Link>
            </Button>
          </ActionsTableWrapper>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record: IContract) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <ManageButtonsWrapper>
        <Button loading={isDeleteLoading} onClick={() => setOpen(true)}>
          Добавить контракт
        </Button>

        <Input
          placeholder="Найти..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
      </ManageButtonsWrapper>

      <Form form={form} component={false}>
        <StyledTableAnt
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={filteredData.map((contract) => ({
            ...contract,
            key: contract.contract_code,
          }))}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>

      <CreateContracts open={open} setOpen={setOpen} refetch={refetch} />
    </>
  );
};
