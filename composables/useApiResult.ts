/**
 * Standardized API Result System
 *
 * Provides consistent error handling and result types across all API methods.
 * All API methods should return ApiResult<T> for consistency.
 */

export interface ApiError {
  code?: string
  message: string
  details?: any
  statusCode?: number
}

export interface ApiResult<T> {
  data: T | null
  error: ApiError | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export interface ApiState<T> {
  data: Ref<T | null>
  error: Ref<ApiError | null>
  isLoading: Ref<boolean>
  isSuccess: Ref<boolean>
  isError: Ref<boolean>
}

/**
 * Create a successful API result
 */
export function createSuccess<T>(data: T): ApiResult<T> {
  return {
    data,
    error: null,
    isLoading: false,
    isSuccess: true,
    isError: false
  }
}

/**
 * Create an error API result
 */
export function createApiError<T>(error: ApiError | string): ApiResult<T> {
  const apiError: ApiError = typeof error === 'string'
    ? { message: error }
    : error

  return {
    data: null,
    error: apiError,
    isLoading: false,
    isSuccess: false,
    isError: true
  }
}

/**
 * Create a loading API result
 */
export function createLoading<T>(): ApiResult<T> {
  return {
    data: null,
    error: null,
    isLoading: true,
    isSuccess: false,
    isError: false
  }
}

/**
 * Parse error from various formats into standardized ApiError
 */
export function parseApiError(error: any): ApiError {
  // Handle fetch/network errors
  if (error.message?.includes('fetch') || error.name === 'TypeError') {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to the server. Please check your internet connection.',
      statusCode: 0
    }
  }

  // Handle AbortController cancellation
  if (error.name === 'AbortError') {
    return {
      code: 'REQUEST_CANCELLED',
      message: 'Request was cancelled',
      statusCode: 0
    }
  }

  // Handle timeout errors
  if (error.message?.includes('timeout')) {
    return {
      code: 'TIMEOUT_ERROR',
      message: 'Request timed out. Please try again.',
      statusCode: 408
    }
  }

  // Handle response errors with structured error data
  if (error.response?._data?.error) {
    const errorData = error.response._data.error
    return {
      code: errorData.code || 'API_ERROR',
      message: errorData.message || 'An error occurred',
      details: errorData.details,
      statusCode: error.response.status
    }
  }

  // Handle response errors with message only
  if (error.response?._data?.message) {
    return {
      code: 'API_ERROR',
      message: error.response._data.message,
      statusCode: error.response.status
    }
  }

  // Handle HTTP status errors
  if (error.response?.status) {
    const statusCode = error.response.status
    let message = 'An error occurred'

    switch (statusCode) {
      case 400:
        message = 'Invalid request. Please check your input.'
        break
      case 401:
        message = 'Unauthorized. Please log in again.'
        break
      case 403:
        message = 'You do not have permission to perform this action.'
        break
      case 404:
        message = 'The requested resource was not found.'
        break
      case 409:
        message = 'A conflict occurred. The resource may already exist.'
        break
      case 422:
        message = 'Validation error. Please check your input.'
        break
      case 429:
        message = 'Too many requests. Please slow down.'
        break
      case 500:
        message = 'Internal server error. Please try again later.'
        break
      case 502:
        message = 'Bad gateway. The server is temporarily unavailable.'
        break
      case 503:
        message = 'Service unavailable. Please try again later.'
        break
      case 504:
        message = 'Gateway timeout. The server took too long to respond.'
        break
    }

    return {
      code: `HTTP_${statusCode}`,
      message,
      statusCode
    }
  }

  // Fallback for unknown errors
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    details: error
  }
}

/**
 * Wrap an async API call with standardized error handling
 */
export async function wrapApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    errorMessage?: string
    showToast?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: ApiError) => void
  }
): Promise<ApiResult<T>> {
  const { showToast = false, onSuccess, onError } = options || {}

  try {
    const data = await apiCall()

    if (onSuccess) {
      onSuccess(data)
    }

    return createSuccess(data)
  } catch (error: any) {
    const apiError = parseApiError(error)

    // Override error message if provided
    if (options?.errorMessage) {
      apiError.message = options.errorMessage
    }

    // Show toast notification if enabled
    if (showToast && process.client) {
      const { notifyError } = useNotify()
      notifyError(apiError.message)
    }

    if (onError) {
      onError(apiError)
    }

    return createApiError<T>(apiError)
  }
}

/**
 * Create reactive API state for use in components
 */
export function useApiState<T>(initialData: T | null = null): ApiState<T> {
  const data = ref<T | null>(initialData)
  const error = ref<ApiError | null>(null)
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const isError = ref(false)

  return {
    data: data as Ref<T | null>,
    error: error as Ref<ApiError | null>,
    isLoading: isLoading as Ref<boolean>,
    isSuccess: isSuccess as Ref<boolean>,
    isError: isError as Ref<boolean>
  }
}

/**
 * Execute API call and update reactive state
 */
export async function executeApiCall<T>(
  state: ApiState<T>,
  apiCall: () => Promise<T>,
  options?: {
    errorMessage?: string
    showToast?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: ApiError) => void
  }
): Promise<ApiResult<T>> {
  // Set loading state
  state.isLoading.value = true
  state.isSuccess.value = false
  state.isError.value = false
  state.error.value = null

  try {
    const result = await wrapApiCall(apiCall, options)

    // Update state based on result
    if (result.isSuccess && result.data !== null) {
      state.data.value = result.data
      state.isSuccess.value = true
      state.isError.value = false
    } else if (result.isError && result.error !== null) {
      state.error.value = result.error
      state.isSuccess.value = false
      state.isError.value = true
    }

    return result
  } finally {
    state.isLoading.value = false
  }
}

/**
 * Composable for API result management
 */
export const useApiResult = <T>(initialData: T | null = null) => {
  const state = useApiState<T>(initialData)

  const execute = async (
    apiCall: () => Promise<T>,
    options?: {
      errorMessage?: string
      showToast?: boolean
      onSuccess?: (data: T) => void
      onError?: (error: ApiError) => void
    }
  ) => {
    return executeApiCall(state, apiCall, options)
  }

  const reset = () => {
    state.data.value = initialData
    state.error.value = null
    state.isLoading.value = false
    state.isSuccess.value = false
    state.isError.value = false
  }

  return {
    ...state,
    execute,
    reset
  }
}
