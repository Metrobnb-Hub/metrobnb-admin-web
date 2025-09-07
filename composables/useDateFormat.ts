export const useDateFormat = () => {
  const formatDate = (dateString: string | null | undefined, options: Intl.DateTimeFormatOptions = {}) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString // Return original if invalid
      
      const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
      }
      
      return date.toLocaleDateString('en-US', defaultOptions)
    } catch (error) {
      return dateString // Return original if error
    }
  }
  
  const formatDateTime = (dateString: string | null | undefined) => {
    return formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const formatDateShort = (dateString: string | null | undefined) => {
    return formatDate(dateString, {
      month: 'short',
      day: 'numeric'
    })
  }
  
  return {
    formatDate,
    formatDateTime,
    formatDateShort
  }
}