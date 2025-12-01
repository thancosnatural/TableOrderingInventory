// src/services/dashboardService.js
import apiClient from "@/utils/api";

/** KPIs */
export const getDashboardKpis = (options = {}) =>
  apiClient.get(`/dashboard/kpis`, { ...options });

/** Revenue trend: ?days=14 */
export const getRevenueTrend = (days = 14, options = {}) =>
  apiClient.get(`/dashboard/revenue-trend`, {
    ...options,
    params: { ...(options.params || {}), days },
  });

/** Sales by category: ?limit=8 */
export const getSalesByCategory = (limit = 8, options = {}) =>
  apiClient.get(`/dashboard/sales-by-category`, {
    ...options,
    params: { ...(options.params || {}), limit },
  });

/** Recent orders list: supports { limit, sort } e.g. { limit:10, sort:"-created_at" } */
export const getOrdersList = (params = {}, options = {}) =>
  apiClient.get(`/orders`, {
    ...options,
    params: { ...(options.params || {}), ...params },
  });

/** Low stock inventory: ?threshold=10&limit=10 */
export const getLowStockInventory = (threshold = 10, limit = 10, options = {}) =>
  apiClient.get(`/dashboard/inventory/low-stock`, {
    ...options,
    params: { ...(options.params || {}), threshold, limit },
  });
