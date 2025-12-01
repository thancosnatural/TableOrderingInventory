import apiClient from "../utils/api";

// Function to fetch a single user by ID
export const addCategory = async (data) => {
    return await apiClient.post(`/categories`, data);
};

export const getCategories = async () => {
    return await apiClient.get(`/categories`,);
};

export const presignUpload = async (data) => {
    return await apiClient.post(`/uploads`, data);
};

// export async function presignUpload({ fileName, contentType, sub = "categories" }) {
//   const { data } = await apiClient.post("/uploads/presign", {
//     entity: "category",
//     sessionId: Date.now().toString(),
//     sub,
//     files: [{ filename: fileName, contentType }],
//   });
//   // normalize to single object
//   return Array.isArray(data) ? data[0] : data;
// }