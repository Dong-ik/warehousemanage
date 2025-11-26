import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./layouts/layout";
import { Warehouse } from "./pages/warehouse";
import { WarehouseList } from "./pages/warehouse/warehouseList";
import { WarehouseAdmin } from "./pages/warehouse/warehouseAdmin";
import { Item } from "./pages/item";
import { ItemList } from "./pages/item/itemList";
import { ItemAdmin } from "./pages/item/itemadmin";
import { Home } from "./pages/home";
import { Breakdown } from "./pages/item/breakdown";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item" element={<Item />} />
        <Route path="/item/itemList" element={<ItemList />} />
        <Route path="/item/breakdown" element={<Breakdown />} />
        <Route path="/item/itemadmin" element={<ItemAdmin />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/warehouse/warehouseList" element={<WarehouseList />} />
        <Route path="/warehouse/warehouseAdmin" element={<WarehouseAdmin />} />
      </Routes>
    </Layout>
  );
}

export default App;
