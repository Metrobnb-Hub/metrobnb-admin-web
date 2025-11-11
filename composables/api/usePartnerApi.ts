import type { Partner, CreatePartnerRequest, UpdatePartnerRequest } from '~/types/api'
import { apiClient } from './apiClient'

/**
 * Partner API composable
 * Handles all partner-related API operations
 */
export const usePartnerApi = () => {
  return {
    /**
     * Get all partners
     * @returns Promise<Partner[]>
     */
    getPartners: async (): Promise<Partner[]> => {
      return await apiClient<Partner[]>('/api/partners')
    },

    /**
     * Get a specific partner by ID
     * @param id - Partner ID
     * @returns Promise<Partner>
     */
    getPartnerById: async (id: string): Promise<Partner> => {
      return await apiClient<Partner>(`/api/partners/${id}`)
    },

    /**
     * Create a new partner
     * @param partner - Partner data
     * @returns Promise<Partner>
     */
    createPartner: async (partner: CreatePartnerRequest): Promise<Partner> => {
      const result = await apiClient<Partner>('/api/partners', {
        method: 'POST',
        body: JSON.stringify(partner)
      })
      const { invalidateCache } = useUnifiedCache()
      invalidateCache('partners')
      return result
    },

    /**
     * Update an existing partner
     * @param id - Partner ID
     * @param partner - Partial partner data to update
     * @returns Promise<Partner>
     */
    updatePartner: async (id: string, partner: UpdatePartnerRequest): Promise<Partner> => {
      const result = await apiClient<Partner>(`/api/partners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(partner)
      })
      const { invalidateCache } = useUnifiedCache()
      invalidateCache('partners')
      return result
    },

    /**
     * Delete a partner
     * @param id - Partner ID
     * @returns Promise<void>
     */
    deletePartner: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/partners/${id}`, { method: 'DELETE' })
    }
  }
}
