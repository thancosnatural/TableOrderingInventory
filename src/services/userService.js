import apiClient from "../utils/api";

export const createUser = (payload) => 
  apiClient.post(`/users/`, payload);

export const getUsers = (params = {}, options = {}) =>
  apiClient.get(`/users`, { params, ...options });

export const getUser = (id) => 
  apiClient.get(`/users/${id}`);

export const getMe = () => 
  apiClient.get(`/users/me`);

export const updateUser = (id, payload) => 
  apiClient.put(`/users/${id}`, payload);

export const disableUser = (id, payload) => 
  apiClient.post(`/users/${id}`, payload);

export const deleteUser = (id, payload) => 
  apiClient.delete(`/users/${id}`, payload);