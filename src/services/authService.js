import { authAPI } from './api';


export const registerUser = async (data) => {
  const response = await authAPI.register(data);
  const { token, user } = response.data.data;
  
  if (token) {
    localStorage.setItem('token', token);
  }
  
  return user;
};


export const loginUser = async ({ email, password }) => {
  const response = await authAPI.login({ email, password });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Login failed');
  }
  
  const { token, user } = response.data.data;
  
  if (!token || !user) {
    throw new Error('Invalid response from server');
  }
  
  localStorage.setItem('token', token);
  
  return user;
};


export const getProfile = async () => {
  const response = await authAPI.getProfile();
  return response.data.data;
};


export const updateProfile = async (data) => {
  const response = await authAPI.updateProfile(data);
  return response.data.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};