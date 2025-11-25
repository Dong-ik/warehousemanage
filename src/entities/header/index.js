import React from "react";
import "./header.css";

const Header = () => (
  <header className="header">
    <h1>Warehouse Manage</h1>
    <div className="header-nav-wrapper">
      <nav>
        <a href="/">Home</a>
        <a href="/inventory">Inventory</a>
        <a href="/orders">Orders</a>
        <a href="/settings">Settings</a>
      </nav>
    </div>
  </header>
);

export default Header;
