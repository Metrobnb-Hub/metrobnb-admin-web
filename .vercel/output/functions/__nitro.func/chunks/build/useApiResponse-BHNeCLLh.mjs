const useApiResponse = () => {
  const extractData = (result) => {
    if ((result == null ? void 0 : result.success) && (result == null ? void 0 : result.data)) {
      return result.data.items || result.data || [];
    }
    if (Array.isArray(result)) {
      return result;
    }
    if (result == null ? void 0 : result.data) {
      return Array.isArray(result.data) ? result.data : [];
    }
    return [];
  };
  const extractPagination = (result) => {
    if ((result == null ? void 0 : result.success) && (result == null ? void 0 : result.data)) {
      const data = result.data;
      return {
        current_page: data.page || 1,
        total_pages: data.pages || 1,
        total_items: data.total || 0,
        per_page: data.limit || 20,
        has_next: (data.page || 1) < (data.pages || 1),
        has_prev: (data.page || 1) > 1
      };
    }
    if (result == null ? void 0 : result.pagination) {
      return result.pagination;
    }
    return null;
  };
  const extractSummary = (result) => {
    var _a;
    return (result == null ? void 0 : result.success) ? (_a = result.data) == null ? void 0 : _a.summary : (result == null ? void 0 : result.summary) || null;
  };
  return {
    extractData,
    extractPagination,
    extractSummary
  };
};

export { useApiResponse as u };
//# sourceMappingURL=useApiResponse-BHNeCLLh.mjs.map
