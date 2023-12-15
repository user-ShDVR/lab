import React from "react";
import { Button, Modal } from "antd";
import { ValidateErrorEntity } from "rc-field-form/es/interface";
import { CreateEmployeeProps } from "./types";
import { formInputs } from "./formInputs";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useCreateEmployeeMutation } from "../../../store/api";
import { ICreateEmployeeRequest } from "../../../store/api/employees/types";

export const CreateEmployees: React.FC<CreateEmployeeProps> = ({
  open,
  setOpen,
  refetch,
}) => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const [form] = CreateForm.useForm();

  const onCreateEmployeeOk = async () => {
    try {
      const employeeValues: ICreateEmployeeRequest =
        await form.validateFields();
      await createEmployee(employeeValues);

      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreateEmployeeFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Добавить сотрудника"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreateEmployeeOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreateEmployeeFailed}
        form={form}
      >
        {formInputs.map((input) => (
          <CreateForm.Item {...input} key={input.name}>
            {input.node}
          </CreateForm.Item>
        ))}
      </CreateForm>
    </Modal>
  );
};
