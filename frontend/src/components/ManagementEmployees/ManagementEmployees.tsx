import React, { useState } from "react";
import { Form, Popconfirm, Button, Input } from "antd";
import { EditableCell } from "./EditableCell";
import {
  ActionsTableWrapper,
  ManageButtonsWrapper,
  StyledTableAnt,
} from "../../styles/managementTableStyles";
import {
  useDeleteEmployeeMutation,
  useGetAllEmployeesQuery,
  useUpdateEmployeeMutation,
} from "../../store/api/employees/employeesApi";
import { IEmployee } from "../../store/api/employees/types";
import { CreateEmployees } from "./CreateEmployees/CreateEmployee";

export const ManagementEmployees = () => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [form] = Form.useForm<IEmployee>();
  const { data: employeesData, refetch } = useGetAllEmployeesQuery();

  const [updateEmployee, { isLoading: isUpdateLoading }] =
    useUpdateEmployeeMutation();

  const [deleteEmployee, { isLoading: isDeleteLoading }] =
    useDeleteEmployeeMutation();

  const [editingKey, setEditingKey] = React.useState("");
  const isEditing = (record: IEmployee) => record.key === editingKey;

  const edit = (record: IEmployee) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields();
      const newData = [...employeesData];
      const index = newData.findIndex((item) => key === item.employee_code);

      if (index > -1) {
        const item = newData[index];
        await updateEmployee({ employee_code: item.employee_code, data: row });

        setEditingKey("");
        refetch();
      } else {
        newData.push(row);
        const item = newData[index];

        await updateEmployee({ employee_code: item.employee_code, data: row });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key: string) => {
    const dataSource = [...employeesData];
    const employeeToDelete = dataSource.find(
      (item) => item.employee_code === key
    );

    try {
      await deleteEmployee(employeeToDelete.employee_code.toString());
      await refetch();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredData = employeesData
    ? employeesData.filter((employee) => {
        const searchRegex = new RegExp(searchValue, "i");
        return (
          searchRegex.test(employee.full_name) ||
          searchRegex.test(employee.phone_number) ||
          searchRegex.test(employee.position) 
        );
      })
    : [];

  const columns = [
    {
      title: "ID",
      dataIndex: "employee_code",
      width: "2%",
      sorter: (a: IEmployee, b: IEmployee) => {
        const aCode = String(a.employee_code);
        const bCode = String(b.employee_code);
        return aCode.localeCompare(bCode);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Фамилия",
      dataIndex: "surname",
      width: "15%",
      editable: true,
      sorter: (a: IEmployee, b: IEmployee) =>
        a.surname.localeCompare(b.surname),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Имя",
      dataIndex: "name",
      width: "15%",
      editable: true,
      sorter: (a: IEmployee, b: IEmployee) =>
        a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Отчество",
      dataIndex: "lastname",
      width: "15%",
      editable: true,
      sorter: (a: IEmployee, b: IEmployee) =>
        a.lastname.localeCompare(b.lastname),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Номер телефона",
      dataIndex: "phone_number",
      width: "15%",
      editable: true,
      sorter: (a: IEmployee, b: IEmployee) =>
        a.phone_number.localeCompare(b.phone_number),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Должность",
      dataIndex: "position",
      width: "15%",
      editable: true,
      sorter: (a: IEmployee, b: IEmployee) =>
        a.position.localeCompare(b.position),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Действия",
      dataIndex: "operation",
      render: (_: never, record: IEmployee) => {
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
              title="Уверены что хотите удалить сотрудника?"
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
      onCell: (record: IEmployee) => ({
        record,
        inputType: col.dataIndex === "phone_number" ? "number" : "text",
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
          Добавить сотрудника
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
          dataSource={filteredData.map((employee) => ({
            ...employee,
            key: employee.employee_code,
          }))}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>

      <CreateEmployees open={open} setOpen={setOpen} refetch={refetch} />
    </>
  );
};
