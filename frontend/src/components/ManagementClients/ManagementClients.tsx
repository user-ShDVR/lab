import React, { useState } from "react";
import { Form, Popconfirm, Button, Input } from "antd";
import { EditableCell } from "./EditableCell";
import {
  ActionsTableWrapper,
  ManageButtonsWrapper,
  StyledTableAnt,
} from "../../styles/managementTableStyles";
import {
  useDeleteClientMutation,
  useGetAllClientsQuery,
  useUpdateClientMutation,
} from "../../store/api/clients/clientsApi";
import { CreateClient } from "./CreateClients/CreateClient";
import { IClient } from "../../store/api/clients/types";

export const ManagementClients = () => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [form] = Form.useForm<IClient>();
  const { data: clientsData, refetch } = useGetAllClientsQuery();

  const [updateClient, { isLoading: isUpdateLoading }] =
    useUpdateClientMutation();

  const [deleteClient, { isLoading: isDeleteLoading }] =
    useDeleteClientMutation();

  const [editingKey, setEditingKey] = React.useState("");
  const isEditing = (record: IClient) => record.key === editingKey;

  const edit = (record: IClient) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields();
      const newData = [...clientsData];
      const index = newData.findIndex((item) => key === item.client_code);

      if (index > -1) {
        const item = newData[index];
        await updateClient({ client_code: item.client_code, data: row });

        setEditingKey("");
        refetch();
      } else {
        newData.push(row);
        const item = newData[index];

        await updateClient({ client_code: item.client_code, data: row });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key: string) => {
    const dataSource = [...clientsData];
    const clientToDelete = dataSource.find((item) => item.client_code === key);

    try {
      await deleteClient(clientToDelete.client_code.toString());
      await refetch();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    {
      title: "Фамилия",
      dataIndex: "surname",
      width: "10%",
      editable: true,
      sorter: (a: IClient, b: IClient) =>
        a.surname.localeCompare(b.surname),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Имя",
      dataIndex: "name",
      width: "10%",
      editable: true,
      sorter: (a: IClient, b: IClient) =>
        a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Отчество",
      dataIndex: "lastname",
      width: "10%",
      editable: true,
      sorter: (a: IClient, b: IClient) =>
        a.lastname.localeCompare(b.lastname),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "10%",
      editable: true,
      sorter: (a: IClient, b: IClient) =>
        a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Адрес",
      dataIndex: "address",
      width: "16%",
      editable: true,
      sorter: (a: IClient, b: IClient) => a.address.localeCompare(b.address),
      sortDirections: ["ascend", "descend"],
    },

    {
      title: "Номер телефона",
      dataIndex: "phone_number",
      width: "15%",
      editable: true,
      sorter: (a: IClient, b: IClient) =>
        a.phone_number.localeCompare(b.phone_number),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Действия",
      dataIndex: "operation",
      render: (_: never, record: IClient) => {
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
            <Button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              type="primary"
            >
              Изменить
            </Button>

            <Popconfirm
              title="Уверены что хотите удалить клиента?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button>Удалить</Button>
            </Popconfirm>
          </ActionsTableWrapper>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record: IClient) => ({
        record,
        inputType: col.dataIndex === "phone_number" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredData = clientsData
    ? clientsData.filter((client) => {
        const searchRegex = new RegExp(searchValue, "i");
        return (
          searchRegex.test(client.surname) ||
          searchRegex.test(client.name) ||
          searchRegex.test(client.lastname) ||
          searchRegex.test(client.salary) ||
          searchRegex.test(client.workplace) ||
          searchRegex.test(client.address) ||
          searchRegex.test(client.phone_number) ||
          searchRegex.test(client.passport_data)
        );
      })
    : [];

  return (
    <>
      <ManageButtonsWrapper>
        <Button loading={isDeleteLoading} onClick={() => setOpen(true)}>
          Добавить клиента
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
          dataSource={filteredData.map((client) => ({
            ...client,
            key: client.client_code,
          }))}
          columns={mergedColumns}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => {
              // refetch();

              const totalPayout = record.order.reduce(
                (acc, client) => acc + parseFloat(client.order_amount),
                0
              );

              return (
                <>
                  Клиент купил товаров за месяц на сумму: <b>{totalPayout.toFixed(2)} ₽</b>
                </>
              );
            },
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </Form>

      <CreateClient open={open} setOpen={setOpen} refetch={refetch} />
    </>
  );
};
