import { Form, Input, InputNumber, Select } from "antd";

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const node =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "select" ? (
      <Select>
        <Select.Option value="ADMIN">Админ</Select.Option>
        <Select.Option value="USER">Пользователь</Select.Option>
      </Select>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {node}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
