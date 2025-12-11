import apiClient from "../utils/api";

export const createRole = (payload) => 
  apiClient.post(`/roles/`, payload);

export const updateRole = (id, payload) => 
  apiClient.put(`/roles/${id}`, payload);

export const deleteRole = (id) => 
  apiClient.delete(`/roles/${id}`,);

export const getRoles = (params = {}, options = {}) =>
  apiClient.get(`/roles`, { params, ...options });

export const getRole = (id, options = {}) =>
  apiClient.get(`/users/${id}`, { ...options });