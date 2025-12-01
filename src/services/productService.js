import apiClient from "../utils/api";

// Function to fetch a single user by ID
export const addProduct = async (data) => {
    return await apiClient.post(`/products`, data);
};

export const getProducts = async ({page=1,limit=20}) => {
    return await apiClient.get(`/products/?page=${page}&limit=${limit}`,);
};

export const getProductById = async (id) => {
    return await apiClient.get(`/products/${id}`,);
}

export const updateProduct = async (id, data) => {
    return await apiClient.post(`/products/${id}`, data);
}

// services/productService.js (or wherever you keep it)
export const imageUpload = async (data, config = {}) => {
    console.log(data)
  // Example: config.params = { public: 1 }, config.onUploadProgress = fn
  return apiClient.post("/uploads/s3", data, config);
};

