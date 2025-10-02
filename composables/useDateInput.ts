export const useDateInput = () => {
  const formatDateForDisplay = (isoDate: string): string => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    })
  }

  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return ''
    return isoDate.split('T')[0]
  }

  return {
    formatDateForDisplay,
    formatDateForInput
  }
}
