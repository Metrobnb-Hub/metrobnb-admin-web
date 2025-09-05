interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'staff' | 'partner'
  organization_id: string
  accessible_partners: string[]
  permissions: string[]
}

interface Organization {
  id: string
  name: string
  plan: string
  status?: string
}

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  organization_name: string
  plan?: string
}

// Sanitize data for logging to prevent log injection
const sanitizeForLog = (data: any) => {
  if (typeof data === 'string') {
    return data.replace(/[\r\n]/g, ' ').substring(0, 100)
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data }
    // Remove sensitive fields from logs
    delete sanitized.password
    delete sanitized.access_token
    delete sanitized.refresh_token
    return JSON.stringify(sanitized).replace(/[\r\n]/g, ' ').substring(0, 200)
  }
  return String(data).replace(/[\r\n]/g, ' ').substring(0, 100)
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const organization = ref<Organization | null>(null)
  const loading = ref(false)
  
  const authToken = useCookie('auth_token', {
    maxAge: 900 // 15 minutes as per docs
  })
  
  const refreshToken = useCookie('refresh_token', {
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  
  // Initialize user from cookie if available
  const userCookie = useCookie('user_data', {
    maxAge: 900,
    serializer: {
      read: (value: string) => {
        try {
          return JSON.parse(value)
        } catch {
          return null
        }
      },
      write: (value: any) => JSON.stringify(value)
    }
  })
  
  const orgCookie = useCookie('org_data', {
    maxAge: 900,
    serializer: {
      read: (value: string) => {
        try {
          return JSON.parse(value)
        } catch {
          return null
        }
      },
      write: (value: any) => JSON.stringify(value)
    }
  })
  
  // Initialize from cookies on startup
  if (authToken.value && userCookie.value) {
    user.value = userCookie.value
    organization.value = orgCookie.value
    console.log('🔐 Restored user from cookie:', {
      id: sanitizeForLog(user.value.id),
      email: sanitizeForLog(user.value.email),
      role: sanitizeForLog(user.value.role)
    })
  }
  
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const config = useRuntimeConfig()
    const apiUrl = `${config.public.apiBaseUrl}/api/auth${endpoint}`
    console.log('🌐 Making auth request to:', apiUrl)
    const response = await fetch(apiUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken.value && { Authorization: `Bearer ${authToken.value}` }),
        ...options.headers
      }
    })
    
    const data = await response.json()
    console.log('🔐 Auth API Response:', { 
      endpoint: sanitizeForLog(endpoint), 
      status: response.status, 
      success: data.success,
      hasUser: !!data.data?.user,
      hasTokens: !!(data.data?.access_token && data.data?.refresh_token)
    })
    
    if (response.status === 401) {
      authToken.value = null
      refreshToken.value = null
      userCookie.value = null
      orgCookie.value = null
      user.value = null
      organization.value = null
      await navigateTo('/login')
      return
    }
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Request failed')
    }
    
    return data
  }
  
  const hasPermission = (permission: string) => {
    return user.value?.permissions?.includes(permission) || ['owner', 'admin'].includes(user.value?.role) || false
  }
  
  const canAccessPartner = (partnerId: string) => {
    if (['owner', 'admin'].includes(user.value?.role)) {
      return true
    }
    return user.value?.accessible_partners?.includes(partnerId) || false
  }
  
  const isAuthenticated = computed(() => !!authToken.value && !!user.value)
  
  const login = async (credentials: LoginData) => {
    loading.value = true
    console.log('🔐 Attempting login with:', { email: credentials.email, password: '***' })
    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      
      console.log('🔐 Login response:', response)
      console.log('🔐 Response type:', typeof response, 'Success:', response?.success)
      
      if (response.success && response.data) {
        // Store user and organization data
        user.value = response.data.user
        organization.value = response.data.organization
        authToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        
        // Also store in cookies to persist across page reloads
        userCookie.value = response.data.user
        orgCookie.value = response.data.organization
        
        console.log('🔐 User set:', {
          id: sanitizeForLog(user.value.id),
          email: sanitizeForLog(user.value.email),
          role: sanitizeForLog(user.value.role),
          hasAccessiblePartners: !!user.value.accessible_partners?.length
        })
        console.log('🔐 Organization set:', {
          id: sanitizeForLog(organization.value?.id),
          name: sanitizeForLog(organization.value?.name)
        })
        console.log('🔐 Tokens set - Access:', !!authToken.value, 'Refresh:', !!refreshToken.value)
        console.log('🔐 Expires in:', response.data.expires_in, 'seconds')
        console.log('🔐 User role:', sanitizeForLog(user.value.role))
        console.log('🔐 Permissions count:', user.value.permissions?.length || 0)
        console.log('🔐 Accessible partners count:', user.value.accessible_partners?.length || 0)
      } else {
        console.error('Unexpected login response structure:', response)
        throw new Error('Invalid login response')
      }
      
      return response
    } finally {
      loading.value = false
    }
  }
  
  const register = async (userData: RegisterData) => {
    loading.value = true
    try {
      const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      })
      
      if (response.success && response.data) {
        user.value = response.data.user
        organization.value = response.data.organization
        authToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        
        userCookie.value = response.data.user
        orgCookie.value = response.data.organization
      }
      
      return response
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' })
      console.log('🔐 Server logout successful (stateless)')
    } catch (error) {
      console.log('🔐 Server logout failed, continuing with client logout:', error)
    }
    
    // Clear all data
    user.value = null
    organization.value = null
    authToken.value = null
    refreshToken.value = null
    userCookie.value = null
    orgCookie.value = null
  }
  
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }
    
    try {
      const response = await apiRequest('/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: refreshToken.value
        })
      })
      
      if (response.success && response.data) {
        authToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        console.log('🔐 Token refreshed successfully')
        return response.data
      }
    } catch (error) {
      console.log('🔐 Token refresh failed:', error)
      // Clear tokens and redirect to login
      authToken.value = null
      refreshToken.value = null
      userCookie.value = null
      orgCookie.value = null
      user.value = null
      organization.value = null
      await navigateTo('/login')
      throw error
    }
  }
  
  const initializeAuth = () => {
    // If we have tokens but no user, we lost the user data
    if (authToken.value && !user.value) {
      console.log('🔐 Token exists but no user data - checking cookies')
      if (userCookie.value) {
        user.value = userCookie.value
        organization.value = orgCookie.value
        console.log('🔐 Restored user from cookies:', {
          id: sanitizeForLog(user.value.id),
          email: sanitizeForLog(user.value.email),
          role: sanitizeForLog(user.value.role)
        })
      } else {
        console.log('🔐 No user data in cookies - user needs to login again')
        authToken.value = null
        refreshToken.value = null
      }
    }
  }
  
  const changePassword = async (passwordData: { current_password: string; new_password: string }) => {
    return await apiRequest('/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    })
  }
  
  const setInitialPassword = async (email: string, currentPassword: string, newPassword: string) => {
    return await apiRequest('/set-password', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        current_password: currentPassword, 
        new_password: newPassword 
      })
    })
  }
  
  const inviteUser = async (userData: { email: string; name: string; role: string; partner_ids?: string[] }) => {
    return await apiRequest('/invite-user', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }
  
  const resetPassword = async (email: string) => {
    return await apiRequest('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }
  
  const getCurrentUser = async () => {
    if (!authToken.value) {
      return null
    }
    
    try {
      const response = await apiRequest('/me')
      if (response.success && response.data) {
        user.value = response.data.user
        organization.value = response.data.organization
        userCookie.value = response.data.user
        orgCookie.value = response.data.organization
      }
      return response.data
    } catch (error) {
      console.log('🔐 Failed to get current user:', error)
      return null
    }
  }
  
  return {
    user: readonly(user),
    organization: readonly(organization),
    loading: readonly(loading),
    isAuthenticated,
    login,
    register,
    logout,
    refreshAccessToken,
    initializeAuth,
    changePassword,
    setInitialPassword,
    resetPassword,
    getCurrentUser,
    inviteUser,
    hasPermission,
    canAccessPartner
  }
}