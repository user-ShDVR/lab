import React from "react";
import { Button, Modal } from "antd";
import { ValidateErrorEntity } from "rc-field-form/es/interface";
import { CreatePledgeProps } from "./types";
import { formInputs } from "./formInputs";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useCreatePledgeMutation } from "../../../store/api";
import { ICreatePledgeRequest } from "../../../store/api/pledges/types";

export const CreatePledge: React.FC<CreatePledgeProps> = ({
  open,
  setOpen,
  refetch,
}) => {
  const [createPledge, { isLoading }] = useCreatePledgeMutation();
  const [form] = CreateForm.useForm();

  const onCreatePledgeOk = async () => {
    try {
      const employeeValues: ICreatePledgeRequest =
        await form.validateFields();
      employeeValues.quanity = parseInt(employeeValues.quanity, 10);
      await createPledge(employeeValues);
      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreatePledgeFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Добавить товар"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreatePledgeOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreatePledgeFailed}
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
