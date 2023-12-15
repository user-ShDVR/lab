import React from "react";
import { Button, Modal } from "antd";
import { ValidateErrorEntity } from "rc-field-form/es/interface";
import { CreateClientProps } from "./types";
import { formInputs } from "./formInputs";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useCreateClientMutation } from "../../../store/api/clients/clientsApi";
import { ICreateClientRequest } from "../../../store/api/clients/types";

export const CreateClient: React.FC<CreateClientProps> = ({
  open,
  setOpen,
  refetch,
}) => {
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [form] = CreateForm.useForm();

  const onCreateClientOk = async () => {
    try {
      const clientValues: ICreateClientRequest = await form.validateFields();
      await createClient(clientValues);

      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreateClientFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Добавить клиента"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreateClientOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreateClientFailed}
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
