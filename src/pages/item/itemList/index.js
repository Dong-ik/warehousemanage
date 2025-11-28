import React, { useState, useEffect } from "react";
import "./itemList.css";
import { itemAPI } from "../../../utils/api";

export const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemAPI.getAll();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("품목을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>로딩 중...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Item List Page</h2>
      <table>
        <thead>
          <tr>
            <th>물품번호</th>
            <th>이미지</th>
            <th>물품이름</th>
            <th>수량</th>
            <th>보관창고</th>
            <th>보관위치</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_id}</td>
                <td className="image-cell">
                  {item.item_filename ? (
                    <img src={`http://localhost:5000/${item.item_filename}`} alt={item.item_name} />
                  ) : (
                    <span className="no-image">이미지 없음</span>
                  )}
                </td>
                <td>{item.item_name}</td>
                <td>{item.item_prop || "-"}</td>
                <td>{item.warehouse_name || "-"}</td>
                <td>{item.wherehouse_inside_index || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                등록된 품목이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
