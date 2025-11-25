import "./App.css";
import Header from "./entities/header";
import Footer from "./entities/footer";
import Sidebar from "./entities/sidebar";

function App() {
  return (
    <div className="layout">
      <Header />
      <Sidebar />
      <main className="main-content">
        <h2>Welcome to Warehouse Manage</h2>
        <p>여기에 메인 콘텐츠가 들어갑니다.</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
