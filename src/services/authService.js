import apiClient from "../utils/api";


export const userLogin = (payload) => {
  console.log("FE → userLogin payload:", payload);
  return apiClient.post(`/users/login`, payload);
};

export const getRoles = (params = {}, options = {}) =>
  apiClient.get(`/roles`, { params, ...options });

export const getUsers = (params = {}, options = {}) =>
  apiClient.get(`/users`, { params, ...options });

/** Single user */
export const getRole = (id, options = {}) =>
  apiClient.get(`/users/${id}`, { ...options });