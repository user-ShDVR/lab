import React, { useState } from "react";
import { toast } from 'react-toastify';
import { Form, Popconfirm, Button, Input } from "antd";
import { EditableCell } from "./EditableCell";
import {
  ActionsTableWrapper,
  ManageButtonsWrapper,
  StyledTableAnt,
} from "../../styles/managementTableStyles";
import {
  useDeletePledgeMutation,
  useGetAllPledgesQuery,
  useUpdatePledgeMutation,
} from "../../store/api/pledges/pledgesApi";
import { CreatePledge } from "./CreatePledges/CreatePledge";
import { IPledge } from "../../store/api/pledges/types";

export const ManagementPledges = () => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const [form] = Form.useForm<IPledge>();
  const { data: pledgesData, error: pledgesError, refetch } = useGetAllPledgesQuery();

  const [updatePledge, { isLoading: isUpdateLoading, error: pledgesUpdateError }] =
    useUpdatePledgeMutation();

  const [deletePledge, { isLoading: isDeleteLoading, error: pledgesDeleteError }] =
    useDeletePledgeMutation();

  const [editingKey, setEditingKey] = React.useState("");
  const isEditing = (record: IPledge) => record.key === editingKey;

  const edit = (record: IPledge) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields();
      const newData = [...pledgesData];
      const index = newData.findIndex((item) => key === item.credit_code);

      if (index > -1) {
        const item = newData[index];
        await updatePledge({ credit_code: item.credit_code, data: row });
        setEditingKey("");
        refetch();
      } else {
        newData.push(row);
        const item = newData[index];

        await updatePledge({ credit_code: item.credit_code, data: row });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key: string) => {
    const dataSource = [...pledgesData];
    const pledgeToDelete = dataSource.find((item) => item.credit_code === key);

    try {
      await deletePledge(pledgeToDelete.credit_code.toString());
      await refetch();
    } catch (error) {
      console.error("Error deleting pledge:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "credit_code",
      width: "1%",
      sorter: (a: IPledge, b: IPledge) => {
        if (!isNaN(Number(a.credit_code)) && !isNaN(Number(b.credit_code))) {
          return Number(a.credit_code) - Number(b.credit_code);
        } else {
          return 0; // Handle non-numeric values appropriately
        }
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Название",
      dataIndex: "credit_name",
      width: "15%",
      editable: true,
      sorter: (a: IPledge, b: IPledge) =>
        a.credit_name.localeCompare(b.credit_name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Минимальная сумма кредита",
      dataIndex: "min_amount",
      width: "10%",
      editable: true,
      render: (min_amount) => `${min_amount}₽`,
    },
    {
      title: "Максимальная сумма кредита",
      dataIndex: "max_amount",
      width: "10%",
      editable: true,
      render: (max_amount) => `${max_amount}₽`,
    },
    {
      title: "Минимальный срок кредитования (в месяцах)",
      dataIndex: "min_credit_term",
      width: "18%",
      editable: true,
    },
    {
      title: "Максимальный срок кредитования(в месяцах)",
      dataIndex: "max_credit_term",
      width: "18%",
      editable: true,
    },
    {
      title: "Процентная ставка",
      dataIndex: "interest_rate",
      width: "10%",
      editable: true,
      render: (interest_rate) => `${interest_rate}%`,
    },
    {
      title: "Действия",
      dataIndex: "operation",
      render: (_: never, record: IPledge) => {
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
              title="Уверены что хотите удалить предмет залога?"
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
      onCell: (record: IPledge) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredData = pledgesData
    ? pledgesData.filter((pledge) => {
        const searchRegex = new RegExp(searchValue, "i");
        return (
          searchRegex.test(pledge.credit_name)
        );
      })
    : [];

  return (
    <>
      <ManageButtonsWrapper>
        <Button loading={isDeleteLoading} onClick={() => setOpen(true)}>
          Добавить кредит
        </Button>

        <Input
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          placeholder="Найти..."
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
          dataSource={filteredData.map((pledge) => ({
            ...pledge,
            key: pledge.credit_code,
          }))}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>

      <CreatePledge open={open} setOpen={setOpen} refetch={refetch} />
    </>
  );
};
