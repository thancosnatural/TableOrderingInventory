import apiClient from "../utils/api";

export async function getCompanies({ query, industry, page = 1, perPage = 12 } = {}) {
    const params = {
        q: query || undefined,
        industry: industry && industry !== "All" ? industry : undefined,
        page,
        perPage,
    };
    return apiClient.get(`/companies`, { params });
}

export async function getCompany(id) {
    return apiClient.get(`/companies/${id}`);
}

export async function createCompany(payload) {
    return apiClient.post(`/companies`, payload);
}

export async function updateCompany(id, payload) {
    apiClient.put(`/companies/${id}`, payload);
}

export async function deleteCompany(id) {
    apiClient.delete(`/companies/${id}`);
}

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
