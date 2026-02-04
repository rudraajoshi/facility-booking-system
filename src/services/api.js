import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// auth apis
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// cat apis
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// state apis
export const stateAPI = {
  getAll: () => api.get('/states'),
  getById: (id) => api.get(`/states/${id}`),
  create: (data) => api.post('/states', data),
  update: (id, data) => api.put(`/states/${id}`, data),
  delete: (id) => api.delete(`/states/${id}`),
};

// city apis
export const cityAPI = {
  getAll: (stateId) =>
    api.get('/cities', {
      params: stateId ? { state_id: stateId } : {},
    }),
  getById: (id) => api.get(`/cities/${id}`),
  create: (data) => api.post('/cities', data),
  update: (id, data) => api.put(`/cities/${id}`, data),
  delete: (id) => api.delete(`/cities/${id}`),
};

// facility apis
export const facilityAPI = {
  getAll: (filters = {}) => api.get('/facilities', { params: filters }),
  getById: (id) => api.get(`/facilities/${id}`),
  create: (data) => api.post('/facilities', data),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
};

// booking apis
export const bookingAPI = {
  getAll: (filters = {}) => api.get('/bookings', { params: filters }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  updateStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, { booking_status: status }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

export default api;
