import apiClient from "../utils/api";

// export const getOrders = async (limit = 8, options = {}) => {
//     return await apiClient.get(`/orders/`, {
//     ...options,
//     params: { ...(options.params || {}), limit },
//   });
// };


export const getOrders = async (params = {}) => {
  // Defaults + keep caller overrides
  const finalParams = {
    page: params.page ?? 1,
    per_page: params.per_page ?? params.limit ?? 20, // accept either per_page or legacy limit
    ...params,
  };

  // Normalize arrays to CSV if any slipped through
  ["status", "payment_status", "source"].forEach((k) => {
    if (Array.isArray(finalParams[k])) {
      finalParams[k] = finalParams[k].join(",");
    }
  });

  // Remove empty values so the URL stays clean
  Object.keys(finalParams).forEach((k) => {
    const v = finalParams[k];
    if (v === undefined || v === null || v === "") delete finalParams[k];
  });

  return apiClient.get("/orders", {
    params: finalParams,
    // If your API wants arrays as repeated keys instead of CSV, use this:
    // paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "brackets" }),
  });
};

export const updateOrderStatus = async (order_id, data) => {
    return await apiClient.post(`/orders/order-status/${order_id}`, data);
};
export const updatePaymentStatus = async (order_id, data) => {
    return await apiClient.post(`/orders/payment-status/${order_id}`, data);
};

export const getOrdersByUserId = async (user_id) => {
    return await apiClient.get(`/orders/${user_id}`);
};

export const getOrderById = async (order_id) => {
    return await apiClient.get(`/orders/${order_id}/order-details`)
}

export const downloadOrderInvoice = async (order_id) => {
    // return await apiClient.get(`/orders/${order_id}/invoice.pdf`)
    const r = await fetch(`/api/v1/orders/${order_id}/invoice`, { credentials: "include" });
    if (!r.ok) throw new Error("Invoice not available");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order_id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export const updateOrder = async (order_id, data) => {
    return await apiClient.put(`/orders/${order_id}`, data);
};

export const cancelOrder = async (order_id) => {
    return await apiClient.delete(`/orders/${order_id}`);
};

export const getNearestOutlet = async (address_id) => {
    return await apiClient.get(`/franchise/nearest/from-address/${address_id}`);
};


export const clearAwaitingPaymentOrders = async () => {
    return await apiClient.get(`/orders/cleanup/awaiting-online`)
}