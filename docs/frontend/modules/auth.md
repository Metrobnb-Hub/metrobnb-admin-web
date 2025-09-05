# MetroBNB Authentication API Guide

## Complete Frontend Integration Guide

### Base URL: `http://localhost:8000`

---

## 🔐 Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Purpose:** Register new user and automatically create organization

**Payload:**
```json
{
  "email": "owner@company.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "organization_name": "My Company",
  "role": "owner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "owner@company.com",
      "name": "John Doe",
      "role": "owner"
    },
    "organization": {
      "id": "uuid",
      "name": "My Company",
      "plan": "free"
    },
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 900
  },
  "message": "Registration successful"
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate user and get access token

**Payload:**
```json
{
  "email": "owner@company.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "owner@company.com",
      "name": "John Doe",
      "role": "owner",
      "organization_id": "uuid",
      "accessible_partners": [],
      "permissions": ["admin"]
    },
    "organization": {
      "id": "uuid",
      "name": "My Company",
      "plan": "free"
    },
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 900,
    "requires_password_change": false
  },
  "message": "Login successful"
}
```

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "owner@company.com",
      "name": "John Doe",
      "role": "owner"
    },
    "organization": {
      "id": "uuid",
      "name": "My Company",
      "plan": "free"
    }
  }
}
```

### 4. Invite User

**Endpoint:** `POST /api/auth/invite-user`

**Headers:** `Authorization: Bearer {access_token}`

**Purpose:** Admin/Owner invites new users to organization

**Payload:**
```json
{
  "email": "staff@company.com",
  "name": "Jane Smith",
  "role": "staff",
  "partner_ids": ["partner_uuid"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "staff@company.com",
    "temporary_password": "temp_abc123",
    "requires_password_change": true
  },
  "message": "User invited successfully"
}
```

### 5. Set Initial Password

**Endpoint:** `POST /api/auth/set-password`

**Purpose:** Set new password after invitation (first-time login)

**Payload:**
```json
{
  "email": "staff@company.com",
  "current_password": "temp_abc123",
  "new_password": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 6. Change Password

**Endpoint:** `POST /api/auth/change-password`

**Headers:** `Authorization: Bearer {access_token}`

**Purpose:** Change password for authenticated user

**Payload:**
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requires_password_change": false
  },
  "message": "Password changed successfully"
}
```

### 7. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔒 Role-Based Access Control (RBAC)

### User Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| `owner` | Full admin access | Organization owner, all permissions |
| `admin` | Most operations | Can manage users, partners, units |
| `staff` | Limited operations | Can view/create basic records |
| `partner` | Partner-specific | Access only to assigned partner data |

### Permission Levels

- **Admin**: Full CRUD operations
- **Read**: View-only access
- **Create**: Can create new records
- **Update**: Can modify existing records

---

## 🚀 Frontend Implementation Guide

### 1. Authentication Flow

```javascript
// 1. Registration
const register = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('access_token', data.data.access_token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

// 2. Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('access_token', data.data.access_token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    // Check if password change required
    if (data.data.requires_password_change) {
      // Redirect to password change page
    }
  }
  return data;
};

// 3. API calls with authentication
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  return response.json();
};
```

### 2. Error Handling

```javascript
const handleApiResponse = (data) => {
  if (!data.success) {
    switch (data.error?.code) {
      case 'INVALID_TOKEN':
        // Redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        break;
      case 'INSUFFICIENT_PERMISSIONS':
        // Show permission error
        alert('You do not have permission for this action');
        break;
      default:
        // Show general error
        alert(data.error?.message || 'An error occurred');
    }
  }
  return data;
};
```

### 3. User Management

```javascript
// Invite user
const inviteUser = async (userData) => {
  return apiCall('/api/auth/invite-user', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

// Set initial password
const setPassword = async (email, currentPassword, newPassword) => {
  return fetch('/api/auth/set-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      current_password: currentPassword,
      new_password: newPassword
    })
  }).then(res => res.json());
};
```

---

## 📝 Complete Integration Example

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const data = await apiCall('/api/auth/me');
        if (data.success) {
          setUser(data.data.user);
        } else {
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  };

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    if (data.success) {
      setUser(data.data.user);
      return { success: true, requiresPasswordChange: data.data.requires_password_change };
    }
    return { success: false, error: data.error?.message };
  };

  const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login: loginUser,
    logout: logoutUser,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Login Component

```jsx
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      if (result.requiresPasswordChange) {
        // Redirect to password change
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 🔧 Error Codes Reference

| Code | Description | Action |
|------|-------------|--------|
| `INVALID_TOKEN` | Token expired/invalid | Redirect to login |
| `INSUFFICIENT_PERMISSIONS` | User lacks permission | Show error message |
| `VALIDATION_ERROR` | Invalid input data | Show field errors |
| `USER_EXISTS` | Email already registered | Show registration error |
| `INVALID_CREDENTIALS` | Wrong email/password | Show login error |

---

## 🎯 Implementation Checklist

- [ ] Set up authentication context/provider
- [ ] Implement login/registration forms
- [ ] Add password change workflow
- [ ] Handle token expiration
- [ ] Implement role-based UI components
- [ ] Add error handling for all auth endpoints
- [ ] Test user invitation flow
- [ ] Implement logout functionality

The API is production-ready with SOLID principles, proper RBAC, and comprehensive error handling!