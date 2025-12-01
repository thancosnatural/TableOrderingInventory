import apiClient from "../utils/api";


export const getRoles = (params = {}, options = {}) =>
  apiClient.get(`/user-roles`, { params, ...options });

/** Single user */
export const getRole = (id, options = {}) =>
  apiClient.get(`/users/${id}`, { ...options });