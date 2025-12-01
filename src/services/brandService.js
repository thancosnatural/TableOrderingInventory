import apiClient from "../utils/api";

// Function to fetch a single user by ID
export const addBrand = async (data) => {
    return await apiClient.post(`/brand`, data);
};

export const getBrands = async () => {
    return await apiClient.get(`/brand`,);
};

