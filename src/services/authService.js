import apiClient from "../utils/api";

export const userLogin = (payload) => 
  apiClient.post(`/users/login`, payload);

export const userLogout = (payload) => 
  apiClient.post(`/users/logout`, payload);

export const changePassword = (payload) => 
  apiClient.post(`/users/change-password`, payload);

export const forgotPassword = (payload) => 
  apiClient.post(`/users/forgot-password`, payload);

export const resetPassword = (payload) => 
  apiClient.post(`/users/reset-password`, payload);
