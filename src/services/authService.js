import { authAPI } from './api';

// new user
export const registerUser = async (data) => {
  const response = await authAPI.register(data);
  return response.data;
};

// login
export const loginUser = async (data) => {
  const response = await authAPI.login(data);

  const { token, user } = response.data;

  if (token) {
    localStorage.setItem('token', token);
  }

  return user;
};


export const getProfile = async () => {
  const response = await authAPI.getProfile();
  return response.data;
};

// update
export const updateProfile = async (data) => {
  const response = await authAPI.updateProfile(data);
  return response.data;
};


// logout
export const logoutUser = () => {
  localStorage.removeItem('token');
};
