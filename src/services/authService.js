import apiClient from "../utils/api";

// Function to fetch a single user by ID
export const requestOtp = async (data) => {
    return await apiClient.post(`/auth/request-otp`, data);
};

export const verifyOtp = async (data) => {
    return await apiClient.post(`/auth/verify-otp`, data);
};

export const fetchUserById = async () => {
    return await apiClient.get(`/auth/me`);
};

export const updateUserProfile = async (userId, data) => {
    return await apiClient.put(`/auth/${userId}`, data);
};

export const requestEditOtp = async (data) => {
    return await apiClient.post(`/auth/otp/request-edit`, data);
};

export const verifyEditOtp = async (data) => {
    return await apiClient.post(`/auth/otp/verify-edit`, data);
};


export const deactivateAccount = async (user_id) => {
    return await apiClient.post(`/auth/${user_id}/deactivate`);
};

export const deleteAccount = async (user_id) => {
    return await apiClient.delete(`/auth/${user_id}`);
};










/** List users (supports q, page, limit, sort, user_type, is_active, is_verified, include_deleted) */
export const getUsers = (params = {}, options = {}) =>
  apiClient.get(`/users`, { params, ...options });

/** Single user */
export const getUser = (id, options = {}) =>
  apiClient.get(`/users/${id}`, { ...options });

/** Create */
export const createUser = (data, options = {}) =>
  apiClient.post(`/users`, data, { ...options });

/** Update */
export const updateUser = (id, data, options = {}) =>
  apiClient.put(`/users/${id}`, data, { ...options });

/** Soft delete (paranoid) */
export const deleteUser = (id, options = {}) =>
  apiClient.delete(`/users/${id}`, { ...options });

/** Hard delete (permanent) */
export const hardDeleteUser = (id, options = {}) =>
  apiClient.delete(`/users/${id}`, { params: { force: true }, ...options });

/** Restore a soft-deleted user */
export const restoreUser = (id, options = {}) =>
  apiClient.post(`/users/${id}/restore`, {}, { ...options });

/** Toggle active */
export const setUserActive = (id, is_active, options = {}) =>
  apiClient.patch(`/users/${id}/active`, { is_active }, { ...options });

/** Toggle verified */
export const setUserVerified = (id, is_verified, options = {}) =>
  apiClient.patch(`/users/${id}/verified`, { is_verified }, { ...options });

/** Bulk operations (adjust to your backend) */
export const bulkDeleteUsers = (ids = [], force = false, options = {}) =>
  apiClient.post(`/users/bulk-delete`, { ids, force }, { ...options });

export const bulkRestoreUsers = (ids = [], options = {}) =>
  apiClient.post(`/users/bulk-restore`, { ids }, { ...options });
