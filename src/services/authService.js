import apiClient from "../utils/api";

export const createUser = (payload) => 
  apiClient.post(`/users/`, payload);

export const userLogin = (payload) => 
  apiClient.post(`/users/login`, payload);

export const getUsers = (params = {}, options = {}) =>
  apiClient.get(`/users`, { params, ...options });

export const createRole = (payload) => 
  apiClient.post(`/roles/`, payload);

export const updateRole = (id, payload) => 
  apiClient.put(`/roles/${id}`, payload);

export const getRoles = (params = {}, options = {}) =>
  apiClient.get(`/roles`, { params, ...options });

/** Single user */
export const getRole = (id, options = {}) =>
  apiClient.get(`/users/${id}`, { ...options });