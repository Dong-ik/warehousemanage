import React, { useState, useEffect } from "react";
import "./warehouseAdmin.css";
import { warehouseAPI, uploadAPI } from "../../../utils/api";

export const WarehouseAdmin = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    warehouse_name: "",
    warehouse_index: "",
    warehouse_inside_filename: "",
    warehouse_manager: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await warehouseAPI.getAll();
      setWarehouses(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      warehouse_name: "",
      warehouse_index: "",
      warehouse_inside_filename: "",
      warehouse_manager: "",
    });
    setIsModalOpen(true);
  };

  const handleEditModal = (warehouse) => {
    setEditingId(warehouse.warehouse_num);
    setImagePreview(warehouse.warehouse_inside_filename ? `http://localhost:5000/${warehouse.warehouse_inside_filename}` : null);
    setFormData({
      warehouse_name: warehouse.warehouse_name,
      warehouse_index: warehouse.warehouse_index || "",
      warehouse_inside_filename: warehouse.warehouse_inside_filename || "",
      warehouse_manager: warehouse.warehouse_manager || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      warehouse_name: "",
      warehouse_index: "",
      warehouse_inside_filename: "",
      warehouse_manager: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const result = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        warehouse_inside_filename: result.imageUrl,
      }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.warehouse_name) {
      alert("창고이름은 필수입니다.");
      return;
    }

    try {
      if (editingId) {
        await warehouseAPI.update(editingId, formData);
        alert("창고가 수정되었습니다.");
      } else {
        await warehouseAPI.create(formData);
        alert("창고가 추가되었습니다.");
      }
      await fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving warehouse:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }

    try {
      await warehouseAPI.delete(id);
      alert("창고가 삭제되었습니다.");
      await fetchData();
    } catch (err) {
      console.error("Error deleting warehouse:", err);
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
      <h2>Warehouse 관리</h2>

      <div className="admin-header">
        <button className="btn btn-primary" onClick={handleOpenModal}>
          + 새 창고 추가
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>창고번호</th>
            <th>이미지</th>
            <th>창고이름</th>
            <th>창고위치</th>
            <th>관리자</th>
            <th>액션</th>
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
                <td>{warehouse.warehouse_manager || "-"}</td>
                <td className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditModal(warehouse)}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(warehouse.warehouse_num)}
                  >
                    삭제
                  </button>
                </td>
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "창고 수정" : "새 창고 추가"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
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
                <label>창고이름 *</label>
                <input
                  type="text"
                  name="warehouse_name"
                  value={formData.warehouse_name}
                  onChange={handleFormChange}
                  placeholder="창고이름을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label>창고위치</label>
                <input
                  type="text"
                  name="warehouse_index"
                  value={formData.warehouse_index}
                  onChange={handleFormChange}
                  placeholder="창고위치를 입력하세요 (예: 서울)"
                />
              </div>

              <div className="form-group">
                <label>관리자</label>
                <input
                  type="text"
                  name="warehouse_manager"
                  value={formData.warehouse_manager}
                  onChange={handleFormChange}
                  placeholder="관리자 이름을 입력하세요"
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
