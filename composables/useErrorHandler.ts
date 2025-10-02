export const useErrorHandler = () => {
  const { notifyError, notifyWarning } = useNotify()

  const handleApiError = (error: any) => {
    const errorData = error?.data || error?.response?._data || {}
    const errorCode = errorData.error?.code
    const errorMessage = errorData.error?.message
    const status = error?.status || error?.response?.status

    // Handle specific error codes
    switch (errorCode) {
      case 'NOT_FOUND':
        notifyError(errorMessage || 'The requested resource was not found.')
        break
      
      case 'VALIDATION_ERROR':
        notifyError(errorMessage || 'Please check your input and try again.')
        break
      
      case 'BAD_REQUEST':
        notifyError(errorMessage || 'Invalid request. Please check your input.')
        break
      
      case 'SERVER_ERROR':
        notifyError('A server error occurred. Please try again later.')
        break
      
      case 'INSUFFICIENT_PERMISSIONS':
      case 'INSUFFICIENT_ROLE':
      case 'FORBIDDEN':
        // These are handled by the API plugin, but we can provide fallback
        notifyWarning(errorMessage || 'You do not have permission for this action.')
        break
      
      default:
        // Handle by HTTP status if no specific error code
        if (status === 404) {
          notifyError('Resource not found.')
        } else if (status === 400) {
          notifyError(errorMessage || 'Invalid request.')
        } else if (status === 500) {
          notifyError('Server error. Please try again later.')
        } else {
          notifyError(errorMessage || 'An unexpected error occurred.')
        }
    }
  }

  return {
    handleApiError
  }
}