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
      const index = newData.findIndex((item) => key === item.product_code);
  
      if (index > -1) {
        const item = { ...row }; // Create a new object
        // Parse quanity as a number
        item.quanity = parseInt(row.quanity, 10);
        await updatePledge({ product_code: key, data: item });
        setEditingKey("");
        refetch();
      } else {
        // If the index is not found, add a new row
        newData.push(row);
        const newItem = { ...newData[newData.length - 1] }; // Create a new object
        // Parse quanity as a number
        newItem.quanity = parseInt(row.quanity, 10);
        await updatePledge({ product_code: newItem.product_code, data: newItem });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key: string) => {
    const dataSource = [...pledgesData];
    const pledgeToDelete = dataSource.find((item) => item.product_code === key);

    try {
      await deletePledge(pledgeToDelete.product_code.toString());
      await refetch();
    } catch (error) {
      console.error("Error deleting pledge:", error);
    }
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "product_name",
      width: "15%",
      editable: true,
      sorter: (a: IPledge, b: IPledge) =>
        a.product_name.localeCompare(b.product_name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Цена",
      dataIndex: "price",
      width: "10%",
      editable: true,
      render: (price) => `${price}₽`,
    },
    {
      title: "Количество",
      dataIndex: "quanity",
      width: "10%",
      editable: true,
      render: (quanity) => `${quanity} шт.`,
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
              title="Уверены что хотите удалить продукт?"
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
          searchRegex.test(pledge.product_code)
        );
      })
    : [];

  return (
    <>
      <ManageButtonsWrapper>
        <Button loading={isDeleteLoading} onClick={() => setOpen(true)}>
          Добавить товар
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
            key: pledge.product_code,
          }))}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>

      <CreatePledge open={open} setOpen={setOpen} refetch={refetch} />
    </>
  );
};
