import apiClient from "../utils/api";

export async function getBranches({ query, page = 1, perPage = 12, company_id } = {}) {
    const params = {
        q: query || undefined,
        page,
        perPage,
        company_id
    };
    return apiClient.get(`/branches`, { params });
}

export async function getBranch(id) {
    return apiClient.get(`/branches/${id}`);
}

export async function createBranch(payload) {
    return apiClient.post(`/branches`, payload);
}

export async function updateBranch(id, payload) {
    apiClient.put(`/branches/${id}`, payload);
}

export async function deleteBranch(id) {
    apiClient.delete(`/branches/${id}`);
}
