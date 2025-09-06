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
  }
  
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const config = useRuntimeConfig()
    const apiUrl = `${config.public.apiBaseUrl}/api/auth${endpoint}`
    const response = await fetch(apiUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken.value && { Authorization: `Bearer ${authToken.value}` }),
        ...options.headers
      }
    })
    
    const data = await response.json()
    
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
    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      
      if (response.success && response.data) {
        // Store user and organization data
        user.value = response.data.user
        organization.value = response.data.organization
        authToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        
        // Also store in cookies to persist across page reloads
        userCookie.value = response.data.user
        orgCookie.value = response.data.organization
        

      } else {
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
    } catch (error) {
      // Continue with client logout even if server logout fails
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
        return response.data
      }
    } catch (error) {
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
      if (userCookie.value) {
        user.value = userCookie.value
        organization.value = orgCookie.value
      } else {
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