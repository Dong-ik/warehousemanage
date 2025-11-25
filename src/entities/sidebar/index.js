import React from "react";
import "./sidebar.css";

const Sidebar = () => (
  <aside className="sidebar">
    <nav>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/inventory">Inventory</a>
        </li>
        <li>
          <a href="/orders">Orders</a>
        </li>
        <li>
          <a href="/settings">Settings</a>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
