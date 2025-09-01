export const getHumanError = (err: any): string => {
  const message = err.message || err.toString()
  
  // Authentication errors
  if (message.includes('401') || message.includes('Unauthorized') || message.includes('Invalid credentials')) {
    return 'Invalid email or password. Please try again.'
  }
  if (message.includes('403') || message.includes('Forbidden')) {
    return 'Access denied. You don\'t have permission to perform this action.'
  }
  if (message.includes('404') || message.includes('Not found')) {
    return 'Resource not found. Please check and try again.'
  }
  
  // Server errors
  if (message.includes('500') || message.includes('Internal server')) {
    return 'Server error. Please try again in a moment.'
  }
  if (message.includes('502') || message.includes('Bad gateway')) {
    return 'Service temporarily unavailable. Please try again later.'
  }
  if (message.includes('503') || message.includes('Service unavailable')) {
    return 'Service is currently down. Please try again later.'
  }
  
  // Network errors
  if (message.includes('Network') || message.includes('fetch') || message.includes('ECONNREFUSED')) {
    return 'Connection error. Please check your internet connection.'
  }
  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }
  
  // Validation errors
  if (message.includes('validation') || message.includes('required')) {
    return 'Please fill in all required fields correctly.'
  }
  if (message.includes('email') && message.includes('invalid')) {
    return 'Please enter a valid email address.'
  }
  
  // Generic fallback
  return 'Something went wrong. Please try again.'
}

export const getSuccessMessage = (action: string, resource?: string): string => {
  const resourceName = resource || 'item'
  
  switch (action) {
    case 'create':
    case 'created':
      return `${resourceName} created successfully!`
    case 'update':
    case 'updated':
      return `${resourceName} updated successfully!`
    case 'delete':
    case 'deleted':
      return `${resourceName} deleted successfully!`
    case 'login':
      return 'Welcome back!'
    case 'logout':
      return 'You have been logged out successfully.'
    case 'save':
    case 'saved':
      return `${resourceName} saved successfully!`
    default:
      return 'Action completed successfully!'
  }
}