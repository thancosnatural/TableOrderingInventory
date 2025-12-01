import apiClient from "@/utils/api";

export const getAdminSettings = () => apiClient.get("/settings");
export const updateAdminSettings = (payload) => apiClient.put("/settings", payload);
export const sendTestNotification = () => apiClient.post("/settings/test-notification");
export const regenerateWebhookSecret = () => apiClient.post("/settings/webhook-secret");