import axios from 'axios';

const API_BASE_URL = '/api';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login') && !currentPath.startsWith('/signup')) {

        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
 
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }
  
 
  if (!imageUrl.startsWith('/')) {
    return `/images/${imageUrl}`;
  }
  
  return imageUrl;
};


export const authAPI = {
  login: async (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  register: async (userData) => {
    return axiosInstance.post('/auth/register', userData);
  },

  logout: async () => {
    return axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async () => {
    return axiosInstance.get('/auth/me');
  },

  getProfile: async () => {
    return axiosInstance.get('/auth/me');
  },

  updateProfile: async (userData) => {
    return axiosInstance.put('/auth/profile', userData);
  },
};


export const bookingAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/bookings?${queryParams}` : '/bookings';
    return axiosInstance.get(url);
  },

  getById: async (id) => {
    return axiosInstance.get(`/bookings/${id}`);
  },

  create: async (bookingData) => {
    console.log('📤 Sending booking payload:', bookingData);
    return axiosInstance.post('/bookings', bookingData);
  },

  update: async (id, updates) => {
    return axiosInstance.put(`/bookings/${id}`, updates);
  },

  cancel: async (id) => {
    return axiosInstance.delete(`/bookings/${id}`);
  },

  updateStatus: async (id, status) => {
    return axiosInstance.put(`/bookings/${id}/status`, { booking_status: status });
  },
};


export const facilityAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/facilities?${queryParams}` : '/facilities';
    return axiosInstance.get(url);
  },

  getById: async (id) => {
    return axiosInstance.get(`/facilities/${id}`);
  },

  create: async (facilityData) => {
    return axiosInstance.post('/facilities', facilityData);
  },

  update: async (id, updates) => {
    return axiosInstance.put(`/facilities/${id}`, updates);
  },

  delete: async (id) => {
    return axiosInstance.delete(`/facilities/${id}`);
  },
};


export const categoryAPI = {
  getAll: async () => {
    return axiosInstance.get('/categories');
  },

  getById: async (id) => {
    return axiosInstance.get(`/categories/${id}`);
  },

  create: async (categoryData) => {
    return axiosInstance.post('/categories', categoryData);
  },

  update: async (id, updates) => {
    return axiosInstance.put(`/categories/${id}`, updates);
  },

  delete: async (id) => {
    return axiosInstance.delete(`/categories/${id}`);
  },
};


export const locationAPI = {

  getAllStates: async () => {
    return axiosInstance.get('/locations/states');
  },

  getStateById: async (id) => {
    return axiosInstance.get(`/locations/states/${id}`);
  },

  createState: async (stateData) => {
    return axiosInstance.post('/locations/states', stateData);
  },

  updateState: async (id, updates) => {
    return axiosInstance.put(`/locations/states/${id}`, updates);
  },

  deleteState: async (id) => {
    return axiosInstance.delete(`/locations/states/${id}`);
  },


  getCitiesByState: async (stateId) => {
    return axiosInstance.get(`/locations/states/${stateId}/cities`);
  },

  createCity: async (stateId, cityData) => {
    return axiosInstance.post(`/locations/states/${stateId}/cities`, cityData);
  },

  updateCity: async (stateId, cityId, updates) => {
    return axiosInstance.put(`/locations/states/${stateId}/cities/${cityId}`, updates);
  },

  deleteCity: async (stateId, cityName) => {
    return axiosInstance.delete(`/locations/states/${stateId}/cities/${encodeURIComponent(cityName)}`);
  },
};


export default axiosInstance;