import React from "react";
import "./header.css";

const Header = () => (
  <header className="header">
    <h1>창고재산관리 시스템</h1>
    <div className="header-nav-wrapper">
      <nav>
        <a href="/">Home</a>
        <a href="/wherehouse">창고관리</a>
        <a href="/item">재산관리</a>
      </nav>
    </div>
  </header>
);

export default Header;
