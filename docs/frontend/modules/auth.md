# Authentication Module

> **JWT Authentication with RBAC for MetroBNB API**

## 🔄 Authentication Flow

### Complete Login Flow
```mermaid
sequenceDiagram
    participant Client as Frontend
    participant API as MetroBNB API
    participant Auth as Auth Provider
    participant DB as Database
    
    Client->>API: POST /api/auth/login {email, password}
    API->>Auth: Generate JWT tokens
    Auth-->>API: {access_token, refresh_token}
    API->>DB: Find user by auth_provider_id
    DB-->>API: AuthUser + UserProfile
    API->>DB: Update last_login timestamp
    API-->>Client: {user, organization, tokens}
    
    Note over Client: Store tokens in cookies
    Note over Client: Redirect to /dashboard
```

### Token Usage Flow
```mermaid
sequenceDiagram
    participant Client as Frontend
    participant API as MetroBNB API
    participant JWT as JWT Middleware
    participant DB as Database
    
    Client->>API: GET /api/partners (Bearer token)
    API->>JWT: Validate JWT token
    JWT->>JWT: Decode token payload
    JWT->>DB: Find user by auth_provider_id
    DB-->>JWT: AuthUser + UserProfile + RBAC
    JWT-->>API: Set request.state (user context)
    API->>DB: Query partners (RBAC filtered)
    DB-->>API: Filtered partner data
    API-->>Client: {success: true, data: partners}
```

### Registration Flow
```mermaid
sequenceDiagram
    participant Client as Frontend
    participant API as MetroBNB API
    participant Auth as Auth Provider
    participant DB as Database
    
    Client->>API: POST /api/auth/register {email, password, name, org}
    API->>Auth: Create auth user
    Auth-->>API: {user_id, tokens}
    API->>DB: Create Organization
    API->>DB: Create AuthUser
    API->>DB: Create UserProfile
    API-->>Client: {user, organization, tokens}
```

## 🔐 Authentication Endpoints

### POST /api/auth/login
**User login with email and password**

**Request:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string
      role: 'admin' | 'manager' | 'staff' | 'partner'
      organization_id: string
      accessible_partners?: string[]
      permissions: string[]
    }
    organization: {
      id: string
      name: string
      plan: string
      status: string
    }
    access_token: string
    refresh_token: string
    expires_in: number
  }
  message: string
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tonynini1998@gmail.com", "password": "test"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "ee1e9b69-9b40-4e5f-9fba-0c9ee5cd3820",
      "email": "tonynini1998@gmail.com",
      "name": "Tony Nini",
      "role": "admin",
      "organization_id": "43d8bb82-8902-46c7-a014-aac2f430fd39",
      "accessible_partners": [],
      "permissions": ["admin"]
    },
    "organization": {
      "id": "43d8bb82-8902-46c7-a014-aac2f430fd39",
      "name": "MetroBNB",
      "plan": "trial"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBhYmFzZS10b255bmluaTE5OTgtZ21haWwtY29tIiwiZW1haWwiOiJ0b255bmluaTE5OThAZ21haWwuY29tIiwiaWF0IjoxNzU2NzA2NTc1LCJleHAiOjE3NTY3MDc0NzV9.z1_oqnGQ2VFkWwB7VL3KCWONQmXQsRiKuAD9NLkDtQQ",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBhYmFzZS10b255bmluaTE5OTgtZ21haWwtY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTY3MDY1NzUsImV4cCI6MTc1NzMxMTM3NX0.qzShUHJGDlUKkE_N8_bA7zJgWwOEIBCKH2RwzyUxDpM",
    "expires_in": 900
  },
  "message": "Login successful"
}
```

## 🔧 Frontend Implementation

### Authentication Store
```typescript
// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff' | 'partner'
  organization_id: string
  accessible_partners?: string[]
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  
  const isAuthenticated = computed(() => !!token.value)
  
  const login = async (email: string, password: string) => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    
    if (response.success) {
      user.value = response.data.user
      token.value = response.data.access_token
      
      const tokenCookie = useCookie('auth_token', {
        maxAge: 900 // 15 minutes
      })
      const refreshCookie = useCookie('refresh_token', {
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      tokenCookie.value = response.data.access_token
      refreshCookie.value = response.data.refresh_token
      
      await navigateTo('/dashboard')
    }
    
    return response
  }
  
  const logout = async () => {
    const { $api } = useNuxtApp()
    
    try {
      await $api('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    user.value = null
    token.value = null
    
    const tokenCookie = useCookie('auth_token')
    const refreshCookie = useCookie('refresh_token')
    tokenCookie.value = null
    refreshCookie.value = null
    
    await navigateTo('/login')
  }
  
  return { user, token, isAuthenticated, login, logout }
})
```

### API Plugin
```typescript
// plugins/api.client.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const tokenCookie = useCookie('auth_token')
      if (tokenCookie.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenCookie.value}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const tokenCookie = useCookie('auth_token')
        tokenCookie.value = null
        navigateTo('/login')
      }
    }
  })
  
  return { provide: { api } }
})
```

### POST /api/auth/logout
**Logout user (client-side token clearing)**

**How it works:**
1. Server returns success message (no server-side action)
2. Client clears tokens from cookies/storage
3. Client redirects to login page
4. Tokens remain valid until expiry (15 minutes max)

**Response:**
```typescript
{
  success: boolean
  message: string
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully. Please clear your local tokens."
}
```

**Security Notes:**
- ✅ **Stateless**: No server-side session storage
- ✅ **Simple**: Just clear client tokens
- ✅ **Auto-expiry**: Tokens expire in 15 minutes
- ⚠️ **Token remains valid**: Until natural expiry
- ⚠️ **No immediate revocation**: Stolen tokens work briefly

### POST /api/auth/refresh
**Refresh access token using refresh token**

**Request:**
```typescript
{
  refresh_token: string
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    access_token: string
    refresh_token: string
    expires_in: number
  }
  message: string
}
```

### POST /api/auth/register
**Register new user and organization**

**Request:**
```typescript
{
  email: string
  password: string
  name: string
  organization_name: string
  plan?: string
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
    organization: {
      id: string
      name: string
      plan: string
    }
    access_token: string
    refresh_token: string
    expires_in: number
  }
  message: string
}
```

## 🔄 Authentication Process

### 1. Login Process
1. **Client sends credentials** to `/api/auth/login`
2. **Auth provider generates JWT** with user identifier
3. **API finds user** in database using `auth_provider_id`
4. **API loads user profile** and organization context
5. **API updates last_login** timestamp
6. **API returns user data** with JWT tokens
7. **Client stores tokens** in cookies (15min + 7 days)
8. **Client redirects** to dashboard

### 2. API Request Process
1. **Client sends request** with `Authorization: Bearer <token>`
2. **JWT Middleware intercepts** and validates token
3. **Middleware decodes JWT** to get `auth_provider_id`
4. **Middleware loads user context** from database
5. **Middleware sets request.state** with user info
6. **API endpoint uses RBAC** to filter data
7. **API returns filtered data** based on user role

### 3. Token Refresh Process
1. **Access token expires** (15 minutes)
2. **Client detects 401 error** from API
3. **Client sends refresh_token** to `/api/auth/refresh`
4. **API validates refresh token** (7 days max)
5. **API generates new access_token** (15 minutes)
6. **Client updates stored tokens**
7. **Client retries original request**

### 4. Logout Process
1. **Client calls** `/api/auth/logout`
2. **API returns success** (no server action)
3. **Client clears tokens** from cookies/storage
4. **Client redirects** to login page
5. **Old tokens remain valid** until natural expiry

## 🔑 Test Credentials

| Role | Email | Password | Access | Status |
|------|-------|----------|---------|--------|
| Admin | tonynini1998@gmail.com | **any password** | 6 partners | ✅ Working |
| Staff | staff@metrobnb.test | **any password** | 2 partners | ✅ Working |
| Partner | hiroaki@partner.test | **any password** | 1 partner | ✅ Working |

## 🔐 JWT Token Details

### Access Token Payload
```json
{
  "sub": "supabase-tonynini1998-gmail-com",
  "email": "tonynini1998@gmail.com",
  "iat": 1756706575,
  "exp": 1756707475
}
```

### Refresh Token Payload
```json
{
  "sub": "supabase-tonynini1998-gmail-com",
  "type": "refresh",
  "iat": 1756706575,
  "exp": 1757311375
}
```

### Token Validation
- **Algorithm**: HS256
- **Secret**: Environment variable `SECRET_KEY`
- **Access Token**: 15 minutes (900 seconds)
- **Refresh Token**: 7 days (604800 seconds)
- **Validation**: JWT middleware decodes and verifies signature

### User Context Resolution
1. **Extract `sub`** from JWT payload
2. **Query AuthUser** by `auth_provider_id = sub`
3. **Load UserProfile** by `auth_user_id`
4. **Load accessible partners** from `user_partner_access`
5. **Set permissions** based on user role
6. **Store in request.state** for RBAC filtering

## ✅ System Status

### **FULLY OPERATIONAL**
- ✅ JWT token generation and validation
- ✅ User authentication with any password (dev mode)
- ✅ RBAC filtering (Admin sees 6 partners)
- ✅ User profile management
- ✅ Organization context
- ✅ Short-lived tokens with refresh
- ✅ Stateless logout