import { authAPI } from '../lib/api';

export const login = async (email, password) => {
  return authAPI.login(email, password);
};

export const register = async (userData) => {
  return authAPI.register(userData);
};

export const getProfile = async () => {
  return authAPI.getProfile();
};

export const updateDetails = async (userData) => {
  return authAPI.updateDetails(userData);
};

export const updatePassword = async (passwordData) => {
  return authAPI.updatePassword(passwordData);
};

export const updateAvatar = async (file) => {
  return authAPI.updateAvatar(file);
};

export const resetPassword = async (email, newPassword) => {
  return authAPI.resetPassword({ email, newPassword });
};