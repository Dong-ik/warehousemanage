import React, { useState, useEffect } from "react";
import "./itemadmin.css";
import { itemAPI, warehouseAPI, uploadAPI } from "../../../utils/api";

export const ItemAdmin = () => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    item_prop: "",
    item_filename: "",
    wherehouse_num: "",
    wherehouse_inside_index: "",
  });

  // 초기 데이터 로드
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsData, warehousesData] = await Promise.all([
        itemAPI.getAll(),
        warehouseAPI.getAll(),
      ]);
      setItems(itemsData);
      setWarehouses(warehousesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 모달 열기 (신규 추가)
  const handleOpenModal = () => {
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      item_name: "",
      item_prop: "",
      item_filename: "",
      wherehouse_num: "",
      wherehouse_inside_index: "",
    });
    setIsModalOpen(true);
  };

  // 모달 열기 (수정)
  const handleEditModal = (item) => {
    setEditingId(item.item_id);
    setImagePreview(item.item_filename ? `http://localhost:5000/${item.item_filename}` : null);
    setFormData({
      item_name: item.item_name,
      item_prop: item.item_prop || "",
      item_filename: item.item_filename || "",
      wherehouse_num: item.wherehouse_num || "",
      wherehouse_inside_index: item.wherehouse_inside_index || "",
    });
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      item_name: "",
      item_prop: "",
      item_filename: "",
      wherehouse_num: "",
      wherehouse_inside_index: "",
    });
  };

  // 폼 입력 처리
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 이미지 파일 선택 처리
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 미리보기 표시
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    // 이미지 업로드
    try {
      setUploading(true);
      const result = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        item_filename: result.imageUrl,
      }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 저장 (추가 또는 수정)
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.item_name || !formData.wherehouse_num) {
      alert("물품이름과 창고는 필수입니다.");
      return;
    }

    try {
      if (editingId) {
        // 수정
        await itemAPI.update(editingId, formData);
        alert("물품이 수정되었습니다.");
      } else {
        // 추가
        await itemAPI.create(formData);
        alert("물품이 추가되었습니다.");
      }
      await fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving item:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }

    try {
      await itemAPI.delete(id);
      alert("물품이 삭제되었습니다.");
      await fetchData();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className="container"><h2>로딩 중...</h2></div>;
  }

  if (error) {
    return <div className="container"><h2 style={{ color: "red" }}>{error}</h2></div>;
  }

  return (
    <div className="container">
      <h2>Item 관리</h2>

      <div className="admin-header">
        <button className="btn btn-primary" onClick={handleOpenModal}>
          + 새 물품 추가
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>물품번호</th>
            <th>이미지</th>
            <th>물품이름</th>
            <th>수량</th>
            <th>보관창고</th>
            <th>보관위치</th>
            <th>액션</th>
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
                <td className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditModal(item)}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(item.item_id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                등록된 물품이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "물품 수정" : "새 물품 추가"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              {/* 이미지 업로드 */}
              <div className="form-group image-upload-group">
                <label>이미지</label>
                <div className="image-upload-box">
                  {imagePreview ? (
                    <img src={imagePreview} alt="미리보기" className="preview-image" />
                  ) : (
                    <div className="upload-placeholder">이미지를 선택하세요</div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                {uploading && <p style={{ color: "#007bff" }}>업로드 중...</p>}
              </div>

              <div className="form-group">
                <label>물품이름 *</label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleFormChange}
                  placeholder="물품이름을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label>수량</label>
                <input
                  type="number"
                  name="item_prop"
                  value={formData.item_prop}
                  onChange={handleFormChange}
                  placeholder="수량을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>보관창고 *</label>
                <select
                  name="wherehouse_num"
                  value={formData.wherehouse_num}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">창고를 선택하세요</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.warehouse_num} value={warehouse.warehouse_num}>
                      {warehouse.warehouse_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>보관위치</label>
                <input
                  type="text"
                  name="wherehouse_inside_index"
                  value={formData.wherehouse_inside_index}
                  onChange={handleFormChange}
                  placeholder="보관위치를 입력하세요 (예: A-1)"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "수정하기" : "추가하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
