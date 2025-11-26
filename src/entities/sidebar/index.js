import React from "react";
import { useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const getMenuItems = () => {
    if (location.pathname === "/") {
      return [{ label: "Home", href: "/" }];
    } else if (location.pathname.startsWith("/item")) {
      return [
        { label: "Item", href: "/item" },
        { label: "Item List", href: "/item/itemList" },
        { label: "Item Admin", href: "/item/itemadmin" },
      ];
    } else if (location.pathname.startsWith("/wherehouse")) {
      return [
        { label: "Wherehouse", href: "/wherehouse" },
        { label: "Wherehouse List", href: "/wherehouse/wherehouseList" },
        { label: "Wherehouse Admin", href: "/wherehouse/wherehouseAdmin" },
      ];
    }
    return [
      { label: "Home", href: "/" },
      { label: "Item", href: "/item" },
      { label: "Wherehouse", href: "/wherehouse" },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
