import type {
  Expense,
  ExpenseFilters,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  PaginatedResponse
} from '~/types/api'
import { apiClient } from './apiClient'

/**
 * Expense API composable
 * Handles all expense-related API operations including bulk operations
 */
export const useExpenseApi = () => {
  return {
    /**
     * Get expenses with optional filters
     * @param filters - Optional filters for expenses
     * @returns Promise<PaginatedResponse<Expense> | Expense[]>
     */
    getExpenses: async (filters: ExpenseFilters = {}): Promise<PaginatedResponse<Expense> | Expense[]> => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.unit_id) params.append('unit_id', filters.unit_id)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.paid_by) params.append('paid_by', filters.paid_by)
      if (filters.paid !== undefined) params.append('paid', filters.paid.toString())
      if (filters.billable !== undefined) params.append('billable', filters.billable.toString())
      if (filters.needs_review !== undefined) params.append('needs_review', filters.needs_review.toString())
      if (filters.month) params.append('month', filters.month)
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
      if (filters.amount_min) params.append('amount_min', filters.amount_min.toString())
      if (filters.amount_max) params.append('amount_max', filters.amount_max.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      if (filters.start_date) params.append('date_from', filters.start_date)
      if (filters.end_date) params.append('date_to', filters.end_date)

      const query = params.toString()
      return await apiClient<any>(`/api/expenses${query ? `?${query}` : ''}`)
    },

    /**
     * Get draft expenses (quick capture)
     * @returns Promise<any>
     */
    getDraftExpenses: async () => {
      return await apiClient<any>('/api/expenses/drafts')
    },

    /**
     * Quick capture expense from receipt
     * @param receiptData - Receipt data
     * @returns Promise<any>
     */
    quickCaptureExpense: async (receiptData: any) => {
      return await apiClient<any>('/api/expenses/quick-capture', {
        method: 'POST',
        body: JSON.stringify(receiptData)
      })
    },

    /**
     * Complete a draft expense
     * @param id - Expense ID
     * @param expenseData - Complete expense data
     * @returns Promise<Expense>
     */
    completeExpense: async (id: string, expenseData: UpdateExpenseRequest): Promise<Expense> => {
      return await apiClient<Expense>(`/api/expenses/${id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify(expenseData)
      })
    },

    /**
     * Update OCR results for an expense
     * @param expenseId - Expense ID
     * @param ocrData - OCR data
     * @returns Promise<any>
     */
    updateExpenseOCR: async (expenseId: string, ocrData: any) => {
      return await apiClient<any>(`/api/expenses/${expenseId}/ocr-results`, {
        method: 'PATCH',
        body: JSON.stringify(ocrData)
      })
    },

    /**
     * Create a new expense
     * @param expense - Expense data
     * @returns Promise<Expense>
     */
    createExpense: async (expense: CreateExpenseRequest): Promise<Expense> => {
      return await apiClient<Expense>('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expense)
      })
    },

    /**
     * Update an existing expense
     * @param id - Expense ID
     * @param expense - Partial expense data to update
     * @returns Promise<Expense>
     */
    updateExpense: async (id: string, expense: UpdateExpenseRequest): Promise<Expense> => {
      return await apiClient<Expense>(`/api/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(expense)
      })
    },

    /**
     * Delete an expense
     * @param id - Expense ID
     * @returns Promise<void>
     */
    deleteExpense: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/expenses/${id}`, { method: 'DELETE' })
    },

    // Bulk Operations

    /**
     * Bulk update multiple expenses
     * @param updates - Array of expense updates
     * @returns Promise<any>
     */
    bulkUpdateExpenses: async (updates: Array<{ id: string; [key: string]: any }>): Promise<any> => {
      return await apiClient<any>('/api/expenses/bulk-update', {
        method: 'PATCH',
        body: JSON.stringify(updates)
      })
    },

    /**
     * Bulk mark expenses as paid
     * @param expenseIds - Array of expense IDs
     * @param paidDate - Optional paid date
     * @returns Promise<any>
     */
    bulkMarkExpensesPaid: async (expenseIds: string[], paidDate?: string): Promise<any> => {
      const params = new URLSearchParams()
      if (paidDate) params.append('paid_date', paidDate)

      return await apiClient<any>(`/api/expenses/bulk-mark-paid${params.toString() ? `?${params.toString()}` : ''}`, {
        method: 'PATCH',
        body: JSON.stringify(expenseIds)
      })
    },

    /**
     * Bulk assign partner to expenses
     * @param expenseIds - Array of expense IDs
     * @param partnerId - Partner ID
     * @returns Promise<any>
     */
    bulkAssignPartner: async (expenseIds: string[], partnerId: string): Promise<any> => {
      return await apiClient<any>(`/api/expenses/bulk-assign-partner?partner_id=${partnerId}`, {
        method: 'PATCH',
        body: JSON.stringify(expenseIds)
      })
    },

    /**
     * Bulk set billable status for expenses
     * @param expenseIds - Array of expense IDs
     * @param billable - Billable status
     * @returns Promise<any>
     */
    bulkSetBillable: async (expenseIds: string[], billable: boolean): Promise<any> => {
      return await apiClient<any>(`/api/expenses/bulk-set-billable?billable=${billable}`, {
        method: 'PATCH',
        body: JSON.stringify(expenseIds)
      })
    },

    /**
     * Bulk delete expenses
     * @param expenseIds - Array of expense IDs
     * @returns Promise<any>
     */
    bulkDeleteExpenses: async (expenseIds: string[]): Promise<any> => {
      return await apiClient<any>('/api/expenses/bulk-delete', {
        method: 'DELETE',
        body: JSON.stringify(expenseIds)
      })
    },

    // Receipt Management

    /**
     * Quick capture receipt
     * @param data - Receipt data
     * @returns Promise<any>
     */
    quickCaptureReceipt: async (data: {
      receipt_url: string
      receipt_public_id: string
      notes?: string
    }) => {
      return await apiClient<any>('/api/expenses/quick-capture', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    /**
     * Complete expense with receipt details
     * @param expenseId - Expense ID
     * @param details - Expense details
     * @returns Promise<any>
     */
    completeExpenseReceipt: async (expenseId: string, details: {
      partner_id: string
      unit_id: string
      amount: string
      type: string
      paid_by?: string
    }) => {
      return await apiClient<any>(`/api/expenses/${expenseId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify(details)
      })
    }
  }
}
