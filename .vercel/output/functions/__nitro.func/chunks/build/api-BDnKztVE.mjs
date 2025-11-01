import { R as useNuxtApp } from './server.mjs';
import { u as useCookie } from './cookie-CGcYVFcE.mjs';

class ApiCache {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.defaultTTL = 15 * 60 * 1e3;
  }
  // 15 minutes - more aggressive caching
  set(key, data, ttl) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  invalidate(pattern) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  has(key) {
    return this.get(key) !== null;
  }
}
const globalCache = new ApiCache();
const useCache = () => {
  const getCacheKey = (endpoint, params) => {
    if (!params) return endpoint;
    const sortedParams = Object.keys(params).sort().reduce((result, key) => {
      if (params[key] !== void 0 && params[key] !== null && params[key] !== "") {
        result[key] = params[key];
      }
      return result;
    }, {});
    return `${endpoint}?${new URLSearchParams(sortedParams).toString()}`;
  };
  const cachedFetch = async (endpoint, params, options) => {
    const cacheKey = getCacheKey(endpoint, params);
    if (!(options == null ? void 0 : options.skipCache)) {
      const cached = globalCache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }
    const { useApi: useApi2 } = await Promise.resolve().then(() => api);
    const api$1 = useApi2();
    let result;
    if (endpoint === "/api/partners") {
      result = await api$1.getPartners();
    } else if (endpoint === "/api/units") {
      result = await api$1.getUnits();
    } else if (endpoint === "/api/booking-sources") {
      result = await api$1.getBookingSources();
    } else if (endpoint === "/api/payment-methods") {
      result = await api$1.getPaymentMethods();
    } else if (endpoint === "/api/services") {
      result = await api$1.getServices();
    } else {
      throw new Error(`Unsupported cached endpoint: ${endpoint}`);
    }
    globalCache.set(cacheKey, result, options == null ? void 0 : options.ttl);
    return result;
  };
  return {
    get: globalCache.get.bind(globalCache),
    set: globalCache.set.bind(globalCache),
    invalidate: globalCache.invalidate.bind(globalCache),
    has: globalCache.has.bind(globalCache),
    cachedFetch,
    getCacheKey
  };
};
const apiClient = async (endpoint, options = {}) => {
  var _a, _b, _c;
  const nuxtApp = useNuxtApp();
  const url = endpoint;
  try {
    const response = await nuxtApp.$api(url, {
      ...options,
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        ...options.headers
      }
    });
    if (response && typeof response === "object" && "success" in response && "data" in response) {
      if (response.data && typeof response.data === "object" && ("items" in response.data || "pagination" in response.data)) {
        return response;
      }
      if (endpoint.includes("/invoices/") && !endpoint.includes("/invoices?")) {
        return response;
      }
      return response.data;
    }
    return response;
  } catch (error) {
    const tokenCookie = useCookie("auth_token");
    ((_a = error.message) == null ? void 0 : _a.includes("fetch")) || error.name === "TypeError" || ((_b = error.message) == null ? void 0 : _b.includes("CORS")) || ((_c = error.message) == null ? void 0 : _c.includes("ERR_FAILED"));
    if (tokenCookie.value && false) ;
    if (endpoint.includes("dashboard")) {
      return {
        success: false,
        data: {
          metrobnb_revenue: "0",
          partner_revenue: "0",
          metrobnb_expenses: "0",
          net_profit: "0",
          partner_count: 0,
          revenue_by_partner: [],
          expense_breakdown: [],
          monthly_trend: [],
          recent_bookings: [],
          recent_expenses: []
        }
      };
    }
    throw error;
  }
};
const useApi = () => {
  return {
    // Services
    getServices: async () => {
      return await apiClient("/api/services");
    },
    createService: async (service) => {
      return await apiClient("/api/services", {
        method: "POST",
        body: JSON.stringify(service)
      });
    },
    updateService: async (id, service) => {
      return await apiClient(`/api/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(service)
      });
    },
    deleteService: async (id) => {
      await apiClient(`/api/services/${id}`, { method: "DELETE" });
    },
    // Partners
    getPartners: async () => {
      return await apiClient("/api/partners");
    },
    getPartnerById: async (id) => {
      return await apiClient(`/api/partners/${id}`);
    },
    createPartner: async (partner) => {
      const result = await apiClient("/api/partners", {
        method: "POST",
        body: JSON.stringify(partner)
      });
      const { invalidate } = useCache();
      invalidate("/api/partners");
      return result;
    },
    updatePartner: async (id, partner) => {
      const result = await apiClient(`/api/partners/${id}`, {
        method: "PUT",
        body: JSON.stringify(partner)
      });
      const { invalidate } = useCache();
      invalidate("/api/partners");
      return result;
    },
    deletePartner: async (id) => {
      await apiClient(`/api/partners/${id}`, { method: "DELETE" });
    },
    // Units
    getUnits: async () => {
      return await apiClient("/api/units");
    },
    getUnitsByPartner: async (partnerId) => {
      return await apiClient(`/api/partners/${partnerId}/units`);
    },
    createUnit: async (unit) => {
      const result = await apiClient("/api/units", {
        method: "POST",
        body: JSON.stringify(unit)
      });
      const { invalidate } = useCache();
      invalidate("/api/units");
      return result;
    },
    updateUnit: async (id, unit) => {
      return await apiClient(`/api/units/${id}`, {
        method: "PUT",
        body: JSON.stringify(unit)
      });
    },
    deleteUnit: async (id) => {
      await apiClient(`/api/units/${id}`, { method: "DELETE" });
    },
    // Booking Sources
    getBookingSources: async () => {
      return await apiClient("/api/booking-sources");
    },
    createBookingSource: async (source) => {
      return await apiClient("/api/booking-sources", {
        method: "POST",
        body: JSON.stringify(source)
      });
    },
    updateBookingSource: async (id, source) => {
      return await apiClient(`/api/booking-sources/${id}`, {
        method: "PUT",
        body: JSON.stringify(source)
      });
    },
    deleteBookingSource: async (id) => {
      await apiClient(`/api/booking-sources/${id}`, { method: "DELETE" });
    },
    // Payment Methods
    getPaymentMethods: async () => {
      return await apiClient("/api/payment-methods");
    },
    // Bookings
    getBookings: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.partner_id) params.append("partner_id", filters.partner_id);
      if (filters.unit_id) params.append("unit_id", filters.unit_id);
      if (filters.month) params.append("month", filters.month);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);
      if (filters.payment_status) params.append("payment_status", filters.payment_status);
      if (filters.payment_received_by) params.append("payment_received_by", filters.payment_received_by);
      if (filters.booking_source_id) params.append("booking_source_id", filters.booking_source_id);
      if (filters.invoiced !== void 0) params.append("invoiced", filters.invoiced.toString());
      const query = params.toString();
      return await apiClient(`/api/bookings${query ? `?${query}` : ""}`);
    },
    createBooking: async (booking) => {
      const result = await apiClient("/api/bookings", {
        method: "POST",
        body: JSON.stringify(booking)
      });
      const { invalidate } = useCache();
      invalidate("/api/bookings");
      invalidate("/api/analytics");
      return result;
    },
    updateBooking: async (id, booking) => {
      return await apiClient(`/api/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify(booking)
      });
    },
    deleteBooking: async (id) => {
      await apiClient(`/api/bookings/${id}`, { method: "DELETE" });
    },
    // Expenses
    getExpenses: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.partner_id) params.append("partner_id", filters.partner_id);
      if (filters.unit_id) params.append("unit_id", filters.unit_id);
      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);
      if (filters.paid_by) params.append("paid_by", filters.paid_by);
      if (filters.paid !== void 0) params.append("paid", filters.paid.toString());
      if (filters.billable !== void 0) params.append("billable", filters.billable.toString());
      if (filters.needs_review !== void 0) params.append("needs_review", filters.needs_review.toString());
      if (filters.month) params.append("month", filters.month);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.amount_min) params.append("amount_min", filters.amount_min.toString());
      if (filters.amount_max) params.append("amount_max", filters.amount_max.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);
      if (filters.start_date) params.append("date_from", filters.start_date);
      if (filters.end_date) params.append("date_to", filters.end_date);
      const query = params.toString();
      return await apiClient(`/api/expenses${query ? `?${query}` : ""}`);
    },
    getDraftExpenses: async () => {
      return await apiClient("/api/expenses/drafts");
    },
    quickCaptureExpense: async (receiptData) => {
      return await apiClient("/api/expenses/quick-capture", {
        method: "POST",
        body: JSON.stringify(receiptData)
      });
    },
    completeExpense: async (id, expenseData) => {
      return await apiClient(`/api/expenses/${id}/complete`, {
        method: "PATCH",
        body: JSON.stringify(expenseData)
      });
    },
    updateExpenseOCR: async (expenseId, ocrData) => {
      return await apiClient(`/api/expenses/${expenseId}/ocr-results`, {
        method: "PATCH",
        body: JSON.stringify(ocrData)
      });
    },
    createExpense: async (expense) => {
      return await apiClient("/api/expenses", {
        method: "POST",
        body: JSON.stringify(expense)
      });
    },
    updateExpense: async (id, expense) => {
      return await apiClient(`/api/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(expense)
      });
    },
    deleteExpense: async (id) => {
      await apiClient(`/api/expenses/${id}`, { method: "DELETE" });
    },
    // Bulk operations
    bulkUpdateExpenses: async (updates) => {
      return await apiClient("/api/expenses/bulk-update", {
        method: "PATCH",
        body: JSON.stringify(updates)
      });
    },
    bulkMarkExpensesPaid: async (expenseIds, paidDate) => {
      const params = new URLSearchParams();
      if (paidDate) params.append("paid_date", paidDate);
      return await apiClient(`/api/expenses/bulk-mark-paid${params.toString() ? `?${params.toString()}` : ""}`, {
        method: "PATCH",
        body: JSON.stringify(expenseIds)
      });
    },
    bulkAssignPartner: async (expenseIds, partnerId) => {
      return await apiClient(`/api/expenses/bulk-assign-partner?partner_id=${partnerId}`, {
        method: "PATCH",
        body: JSON.stringify(expenseIds)
      });
    },
    bulkSetBillable: async (expenseIds, billable) => {
      return await apiClient(`/api/expenses/bulk-set-billable?billable=${billable}`, {
        method: "PATCH",
        body: JSON.stringify(expenseIds)
      });
    },
    bulkDeleteExpenses: async (expenseIds) => {
      return await apiClient("/api/expenses/bulk-delete", {
        method: "DELETE",
        body: JSON.stringify(expenseIds)
      });
    },
    // Analytics
    getPartnerEarnings: async (partnerId) => {
      const result = await apiClient(`/api/analytics/partner-earnings/${partnerId}`);
      return result.total_earnings;
    },
    getPartnerExpenses: async (partnerId) => {
      const result = await apiClient(`/api/analytics/partner-expenses/${partnerId}`);
      return result.total_expenses;
    },
    getDashboardMetrics: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.partner_id) params.append("partner_id", filters.partner_id);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      const query = params.toString();
      return await apiClient(`/api/analytics/dashboard${query ? `?${query}` : ""}`);
    },
    // Invoices - New Workflow
    // Admin only: Create draft invoice
    createDraftInvoice: async (partnerId, startDate, endDate) => {
      return await apiClient("/api/invoices/draft", {
        method: "POST",
        body: JSON.stringify({
          partner_id: partnerId,
          start_date: startDate,
          end_date: endDate
        })
      });
    },
    // Admin only: Refresh draft data
    refreshInvoice: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}/refresh`, { method: "PUT" });
    },
    // Partner only: Approve draft invoice
    approveInvoice: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}/approve`, { method: "PATCH" });
    },
    // Partner only: Reject draft invoice with notes
    rejectInvoice: async (invoiceId, notes) => {
      return await apiClient(`/api/invoices/${invoiceId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ notes })
      });
    },
    // Admin only: Finalize invoice (bypass partner approval)
    finalizeInvoice: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}/finalize`, { method: "PUT" });
    },
    // Admin only: Send invoice
    sendInvoice: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}/send`, { method: "PUT" });
    },
    getInvoices: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.partner_id) params.append("partner_id", filters.partner_id);
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);
      const query = params.toString();
      return await apiClient(`/api/invoices${query ? `?${query}` : ""}`);
    },
    getArchivedInvoices: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.partner_id) params.append("partner_id", filters.partner_id);
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);
      const query = params.toString();
      return await apiClient(`/api/invoices/archive${query ? `?${query}` : ""}`);
    },
    getInvoiceById: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}`);
    },
    // Admin only: Mark as paid
    settleInvoice: async (invoiceId, paidDate) => {
      return await apiClient(`/api/invoices/${invoiceId}/settle`, {
        method: "PATCH",
        body: JSON.stringify({ paid_date: paidDate })
      });
    },
    deleteInvoice: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}`, { method: "DELETE" });
    },
    cancelInvoice: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}/cancel`, { method: "PATCH" });
    },
    updateInvoice: async (invoiceId, data) => {
      return await apiClient(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },
    regenerateInvoice: async (invoiceId) => {
      return await apiClient(`/api/invoices/${invoiceId}/regenerate`, { method: "POST" });
    },
    // Journal Entries
    getJournalEntries: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.partner_id) params.append("partner_id", filters.partner_id);
      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);
      const query = params.toString();
      return await apiClient(`/api/journal-entries${query ? `?${query}` : ""}`);
    },
    createJournalEntry: async (data) => {
      return await apiClient("/api/journal-entries", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    updateJournalEntry: async (id, data) => {
      return await apiClient(`/api/journal-entries/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },
    settleJournalEntry: async (id, data) => {
      return await apiClient(`/api/journal-entries/${id}/settle`, {
        method: "PATCH",
        body: JSON.stringify(data)
      });
    },
    deleteJournalEntry: async (id) => {
      await apiClient(`/api/journal-entries/${id}`, { method: "DELETE" });
    },
    // Booking Stats
    getBookingStats: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.partner_id) params.append("partner_id", filters.partner_id);
      if (filters.unit_id) params.append("unit_id", filters.unit_id);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      const query = params.toString();
      return await apiClient(`/api/bookings/stats/summary${query ? `?${query}` : ""}`);
    },
    // Airbnb Import
    importAirbnbBookings: async (data) => {
      const result = await apiClient("/api/airbnb/import", {
        method: "POST",
        body: JSON.stringify(data)
      });
      const { invalidate } = useCache();
      invalidate("/api/bookings");
      invalidate("/api/analytics");
      return result;
    },
    // File Upload
    uploadFile: async (file, folder = "receipts") => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      return await apiClient("/api/files/upload", {
        method: "POST",
        body: formData
      });
    },
    // Receipt Management
    quickCaptureReceipt: async (data) => {
      return await apiClient("/api/expenses/quick-capture", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    completeExpenseReceipt: async (expenseId, details) => {
      return await apiClient(`/api/expenses/${expenseId}/complete`, {
        method: "PATCH",
        body: JSON.stringify(details)
      });
    },
    // Users
    getUserList: async () => {
      return await apiClient("/api/users/list");
    },
    createUser: async (userData) => {
      return await apiClient("/api/users", {
        method: "POST",
        body: JSON.stringify(userData)
      });
    },
    regeneratePassword: async (userId) => {
      return await apiClient(`/api/users/${userId}/regenerate-password`, { method: "POST" });
    },
    deleteUser: async (userId) => {
      return await apiClient(`/api/users/${userId}`, { method: "DELETE" });
    },
    // Reports
    getEarningsSummary: async (startDate, endDate, organizationId) => {
      const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
      if (organizationId) params.append("organization_id", organizationId);
      return await apiClient(`/api/reports/earnings-summary?${params.toString()}`);
    },
    getCurrentMonthEarnings: async (organizationId) => {
      const params = new URLSearchParams();
      if (organizationId) params.append("organization_id", organizationId);
      return await apiClient(`/api/reports/earnings-summary/current-month${params.toString() ? `?${params.toString()}` : ""}`);
    },
    getLastMonthEarnings: async (organizationId) => {
      const params = new URLSearchParams();
      if (organizationId) params.append("organization_id", organizationId);
      return await apiClient(`/api/reports/earnings-summary/last-month${params.toString() ? `?${params.toString()}` : ""}`);
    },
    // Helpers
    getBookingTotal: (booking) => {
      var _a;
      if (!booking) return 0;
      const baseAmount = parseFloat(booking.base_amount) || 0;
      const addonsTotal = ((_a = booking.addons) == null ? void 0 : _a.reduce((sum, addon) => sum + (addon.amount || 0), 0)) || 0;
      return baseAmount + addonsTotal;
    }
  };
};
const api = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  useApi
}, Symbol.toStringTag, { value: "Module" }));

export { useCache as a, useApi as u };
//# sourceMappingURL=api-BDnKztVE.mjs.map
