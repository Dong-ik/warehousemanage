// API 기본 URL
const API_BASE_URL = 'http://localhost:5000/api';

// 헬퍼 함수: GET 요청
export const getRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('GET 요청 오류:', error);
    throw error;
  }
};

// 헬퍼 함수: POST 요청
export const postRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('POST 요청 오류:', error);
    throw error;
  }
};

// 헬퍼 함수: PUT 요청
export const putRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('PUT 요청 오류:', error);
    throw error;
  }
};

// 헬퍼 함수: DELETE 요청
export const deleteRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('DELETE 요청 오류:', error);
    throw error;
  }
};

// Warehouse API
export const warehouseAPI = {
  getAll: () => getRequest('/warehouse'),
  getById: (id) => getRequest(`/warehouse/${id}`),
  create: (data) => postRequest('/warehouse', data),
  update: (id, data) => putRequest(`/warehouse/${id}`, data),
  delete: (id) => deleteRequest(`/warehouse/${id}`),
};

// Item API
export const itemAPI = {
  getAll: () => getRequest('/item'),
  getById: (id) => getRequest(`/item/${id}`),
  getByWarehouse: (warehouseNum) => getRequest(`/item/warehouse/${warehouseNum}`),
  create: (data) => postRequest('/item', data),
  update: (id, data) => putRequest(`/item/${id}`, data),
  delete: (id) => deleteRequest(`/item/${id}`),
};

// Breakdown API
export const breakdownAPI = {
  getAll: () => getRequest('/breakdown'),
  getById: (id) => getRequest(`/breakdown/${id}`),
  create: (data) => postRequest('/breakdown', data),
  update: (id, data) => putRequest(`/breakdown/${id}`, data),
  delete: (id) => deleteRequest(`/breakdown/${id}`),
};

// BreakdownDetail API
export const breakdownDetailAPI = {
  getAll: () => getRequest('/breakdown-detail'),
  getById: (id) => getRequest(`/breakdown-detail/${id}`),
  getByBreakdown: (breakdownId) => getRequest(`/breakdown-detail/breakdown/${breakdownId}`),
  create: (data) => postRequest('/breakdown-detail', data),
  update: (id, data) => putRequest(`/breakdown-detail/${id}`, data),
  delete: (id) => deleteRequest(`/breakdown-detail/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      throw error;
    }
  },
  deleteImage: (filename) => deleteRequest(`/upload/${filename}`),
};
