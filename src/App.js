import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./layouts/layout";
import { Wherehouse } from "./pages/wherehouse";
import { wherehouseList as WherehouseList } from "./pages/wherehouse/wherehouseList";
import { wherehouseAdmin as WherehouseAdmin } from "./pages/wherehouse/wherehouseAdmin";
import { Item } from "./pages/item";
import { itemList as ItemList } from "./pages/item/itemList";
import { itemAdmin as ItemAdmin } from "./pages/item/itemadmin";
import { Home } from "./pages/home";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item" element={<Item />} />
        <Route path="/item/itemList" element={<ItemList />} />
        <Route path="/item/itemadmin" element={<ItemAdmin />} />
        <Route path="/wherehouse" element={<Wherehouse />} />
        <Route path="/wherehouse/wherehouseList" element={<WherehouseList />} />
        <Route path="/wherehouse/wherehouseAdmin" element={<WherehouseAdmin />} />
      </Routes>
    </Layout>
  );
}

export default App;
