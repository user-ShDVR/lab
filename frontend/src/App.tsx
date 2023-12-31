import { ManagementClients } from "./components/ManagementClients/ManagementClients";
import { ManagementContracts } from "./components/ManagementContracts/ManagementContracts";
import { ManagementEmployees } from "./components/ManagementEmployees/ManagementEmployees";
import { ManagementPledges } from "./components/ManagementPledges/ManagementPledges";
import { Tabs, Typography } from "antd";

function App() {
  const tabs = [
    {
      key: "clients",
      label: "Клиенты",
      children: <ManagementClients />,
    },
    {
      key: "employees",
      label: "Продавцы",
      children: <ManagementEmployees />,
    },
    {
      key: "credits",
      label: "Товары",
      children: <ManagementPledges />,
    },
    {
      key: "contracts",
      label: "Заказы",
      children: <ManagementContracts />,
    },
  ];

  return (
    <div style={{ margin: "40px" }}>
      <Typography.Title>Админ панель</Typography.Title>
      <Tabs defaultActiveKey="1" items={tabs} />
    </div>
  );
}

export default App;
