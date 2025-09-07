export interface InvoiceAction {
  label: string
  action: string
  color: string
  icon: string
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

export const useInvoiceWorkflow = () => {
  const { user } = useAuth()
  
  const isAdmin = computed(() => ['owner', 'admin'].includes(user.value?.role || ''))
  const isPartner = computed(() => user.value?.role === 'partner')
  
  /**
   * Get available actions for an invoice based on status and user role
   */
  const getInvoiceActions = (invoice: any): InvoiceAction[] => {
    const actions: InvoiceAction[] = []
    
    if (!invoice?.status) return actions
    
    switch (invoice.status) {
      case 'draft':
        if (isPartner.value) {
          // Partner can approve or reject drafts
          actions.push({
            label: 'Approve Invoice',
            action: 'approve',
            color: 'green',
            icon: 'i-heroicons-check-circle',
            requiresConfirmation: true,
            confirmationMessage: 'Approve this invoice? Once approved, it will be finalized and ready to send.'
          })
          actions.push({
            label: 'Reject Invoice',
            action: 'reject',
            color: 'red',
            icon: 'i-heroicons-x-circle',
            requiresConfirmation: true,
            confirmationMessage: 'Reject this invoice? Please provide a reason for rejection.'
          })
        } else if (isAdmin.value) {
          // Admin can refresh data or finalize (bypass approval)
          actions.push({
            label: 'Refresh Data',
            action: 'refresh',
            color: 'gray',
            icon: 'i-heroicons-arrow-path'
          })
          actions.push({
            label: 'Finalize',
            action: 'finalize',
            color: 'blue',
            icon: 'i-heroicons-lock-closed',
            requiresConfirmation: true,
            confirmationMessage: 'Finalize this invoice? This will bypass partner approval and lock the invoice.'
          })
        }
        break
        
      case 'finalized':
        if (isAdmin.value) {
          // Only admin can send finalized invoices
          actions.push({
            label: 'Send Invoice',
            action: 'send',
            color: 'purple',
            icon: 'i-heroicons-paper-airplane',
            requiresConfirmation: true,
            confirmationMessage: 'Send this invoice to the partner?'
          })
        }
        break
        
      case 'sent':
        if (isAdmin.value) {
          // Only admin can mark as paid
          actions.push({
            label: 'Mark as Paid',
            action: 'settle',
            color: 'green',
            icon: 'i-heroicons-check-circle'
          })
        }
        break
        
      case 'paid':
        // No actions available for paid invoices
        break
        
      case 'rejected':
        if (isAdmin.value) {
          // Admin can refresh rejected invoices to create new draft
          actions.push({
            label: 'Create New Draft',
            action: 'refresh',
            color: 'blue',
            icon: 'i-heroicons-arrow-path',
            requiresConfirmation: true,
            confirmationMessage: 'Create a new draft based on this rejected invoice?'
          })
        }
        break
        
      case 'cancelled':
        // No actions available for cancelled invoices
        break
    }
    
    return actions
  }
  
  /**
   * Get status display text based on user role
   */
  const getStatusText = (status: string, isPartnerView = false): string => {
    if (isPartnerView || isPartner.value) {
      // Partner's perspective - action-oriented
      const partnerStatusMap: Record<string, string> = {
        'draft': 'Awaiting Your Approval',
        'finalized': 'Approved & Ready',
        'sent': 'Invoice Sent',
        'paid': 'Payment Complete ✓',
        'rejected': 'Rejected by You',
        'cancelled': 'Cancelled'
      }
      return partnerStatusMap[status] || status
    } else {
      // Admin's perspective - process-oriented
      const adminStatusMap: Record<string, string> = {
        'draft': 'Draft',
        'finalized': 'Finalized',
        'sent': 'Sent',
        'paid': 'Paid',
        'rejected': 'Rejected',
        'cancelled': 'Cancelled'
      }
      return adminStatusMap[status] || status
    }
  }
  
  /**
   * Get status color for badges
   */
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'draft': 'yellow',
      'finalized': 'blue',
      'sent': 'purple',
      'paid': 'green',
      'rejected': 'orange',
      'cancelled': 'red'
    }
    return colors[status] || 'gray'
  }
  
  /**
   * Check if user can perform specific action on invoice
   */
  const canPerformAction = (invoice: any, action: string): boolean => {
    const availableActions = getInvoiceActions(invoice)
    return availableActions.some(a => a.action === action)
  }
  
  /**
   * Get next status after performing an action
   */
  const getNextStatus = (currentStatus: string, action: string): string => {
    const statusFlow: Record<string, Record<string, string>> = {
      'draft': {
        'approve': 'finalized',
        'finalize': 'finalized',
        'refresh': 'draft' // stays draft
      },
      'finalized': {
        'send': 'sent'
      },
      'sent': {
        'settle': 'paid'
      }
    }
    
    return statusFlow[currentStatus]?.[action] || currentStatus
  }
  
  /**
   * Validate invoice workflow transition
   */
  const validateTransition = (invoice: any, action: string): { valid: boolean; error?: string } => {
    if (!invoice) {
      return { valid: false, error: 'Invoice not found' }
    }
    
    const userRole = user.value?.role
    
    // Check role permissions
    if ((action === 'approve' || action === 'reject') && userRole !== 'partner') {
      return { valid: false, error: 'Only partners can approve or reject invoices' }
    }
    
    if (['refresh', 'finalize', 'send', 'settle'].includes(action) && !['owner', 'admin'].includes(userRole || '')) {
      return { valid: false, error: 'Only admins can perform this action' }
    }
    
    // Check status transitions
    if ((action === 'approve' || action === 'reject') && invoice.status !== 'draft') {
      return { valid: false, error: 'Can only approve or reject draft invoices' }
    }
    
    if (action === 'finalize' && invoice.status !== 'draft') {
      return { valid: false, error: 'Can only finalize draft invoices' }
    }
    
    if (action === 'send' && invoice.status !== 'finalized') {
      return { valid: false, error: 'Can only send finalized invoices' }
    }
    
    if (action === 'settle' && invoice.status !== 'sent') {
      return { valid: false, error: 'Can only settle sent invoices' }
    }
    
    return { valid: true }
  }
  
  return {
    isAdmin,
    isPartner,
    getInvoiceActions,
    getStatusText,
    getStatusColor,
    canPerformAction,
    getNextStatus,
    validateTransition
  }
}