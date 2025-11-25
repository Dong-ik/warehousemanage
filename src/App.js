import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./layouts/layout";
import { Wherehouse } from "./pages/wherehouse";
import { Item } from "./pages/item";
import { Home } from "./pages/home";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wherehouse" element={<Wherehouse />} />
        <Route path="/item" element={<Item />} />
      </Routes>
    </Layout>
  );
}

export default App;
