import React, { useState, useEffect } from "react";
import "./wherehouseList.css";
import { warehouseAPI } from "../../../utils/api";

export const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehouseAPI.getAll();
      setWarehouses(data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
      setError("창고 목록을 불러올 수 없습니다.");
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
      <h2>Warehouse List Page</h2>
      <table>
        <thead>
          <tr>
            <th>창고번호</th>
            <th>이미지</th>
            <th>창고이름</th>
            <th>창고위치</th>
            <th>내부형상</th>
            <th>창고 관리자</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.length > 0 ? (
            warehouses.map((warehouse) => (
              <tr key={warehouse.warehouse_num}>
                <td>{warehouse.warehouse_num}</td>
                <td className="image-cell">
                  {warehouse.warehouse_inside_filename ? (
                    <img src={`http://localhost:5000/${warehouse.warehouse_inside_filename}`} alt={warehouse.warehouse_name} />
                  ) : (
                    <span className="no-image">이미지 없음</span>
                  )}
                </td>
                <td>{warehouse.warehouse_name}</td>
                <td>{warehouse.warehouse_index || "-"}</td>
                <td>{warehouse.warehouse_inside_filename ? "이미지 등록됨" : "-"}</td>
                <td>{warehouse.warehouse_manager || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                등록된 창고가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
