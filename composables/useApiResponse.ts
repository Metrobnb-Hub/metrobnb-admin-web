// Standard API response handler for consistent data extraction
export const useApiResponse = () => {
  const extractData = (result: any): any[] => {
    if (result?.success && result?.data) {
      // New API format: {success: true, data: {items: [...]} or [...]}
      return result.data.items || result.data || []
    }
    
    if (Array.isArray(result)) {
      // Direct array response
      return result
    }
    
    if (result?.data) {
      // Legacy format: {data: [...]}
      return Array.isArray(result.data) ? result.data : []
    }
    
    return []
  }

  const extractPagination = (result: any) => {
    if (result?.success && result?.data) {
      const data = result.data
      return {
        current_page: data.page || 1,
        total_pages: data.pages || 1,
        total_items: data.total || 0,
        per_page: data.limit || 20,
        has_next: (data.page || 1) < (data.pages || 1),
        has_prev: (data.page || 1) > 1
      }
    }
    
    if (result?.pagination) {
      return result.pagination
    }
    
    return null
  }

  const extractSummary = (result: any) => {
    return result?.success ? result.data?.summary : result?.summary || null
  }

  return {
    extractData,
    extractPagination,
    extractSummary
  }
}