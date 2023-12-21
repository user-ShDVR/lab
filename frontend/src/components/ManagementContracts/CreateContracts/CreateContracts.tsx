import React from "react";
import { Button, Modal } from "antd";
import { ValidateErrorEntity } from "rc-field-form/es/interface";
import { CreateContractProps } from "./types";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useCreateContractMutation } from "../../../store/api";
import { ICreateContractRequest } from "../../../store/api/contracts/types";
import { FormInputs } from "./formInputs";

export const CreateContracts: React.FC<CreateContractProps> = ({
  open,
  setOpen,
  refetch,
}) => {
  const [createContract, { isLoading }] = useCreateContractMutation();
  const [form] = CreateForm.useForm();
  

  const onCreateContractOk = async () => {
    try {
      const employeeValues: ICreateContractRequest =
        await form.validateFields();
        // employeeValues.contract_amount = parseInt(employeeValues.contract_amount, 10);
        employeeValues.quanity = parseInt(employeeValues.quanity, 10);
      await createContract(employeeValues);

      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreateContractFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  }; 

  return (
    <Modal
      title="Добавить заказ"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreateContractOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreateContractFailed}
        form={form}
      >
        <FormInputs form={form} />
      </CreateForm>
    </Modal>
  );
};
