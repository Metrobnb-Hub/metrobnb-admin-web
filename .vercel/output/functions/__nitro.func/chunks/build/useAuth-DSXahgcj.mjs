import { ref, computed, readonly } from 'vue';
import { u as useCookie } from './cookie-CGcYVFcE.mjs';
import { c as useRuntimeConfig, n as navigateTo } from './server.mjs';

const useAuth = () => {
  const user = ref(null);
  const organization = ref(null);
  const loading = ref(false);
  const authToken = useCookie("auth_token", {
    maxAge: 900
    // 15 minutes as per docs
  });
  const refreshToken = useCookie("refresh_token", {
    maxAge: 60 * 60 * 24 * 7
    // 7 days
  });
  const userCookie = useCookie("user_data", {
    maxAge: 900,
    serializer: {
      read: (value) => {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      },
      write: (value) => JSON.stringify(value)
    }
  });
  const orgCookie = useCookie("org_data", {
    maxAge: 900,
    serializer: {
      read: (value) => {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      },
      write: (value) => JSON.stringify(value)
    }
  });
  if (authToken.value && userCookie.value) {
    user.value = userCookie.value;
    organization.value = orgCookie.value;
  }
  const apiRequest = async (endpoint, options = {}) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const config = useRuntimeConfig();
    const apiUrl = `${config.public.apiBaseUrl}/api/auth${endpoint}`;
    let response;
    let data;
    try {
      response = await fetch(apiUrl, {
        ...options,
        keepalive: true,
        // Keep connection alive during tab switches
        headers: {
          "Content-Type": "application/json",
          ...authToken.value && { Authorization: `Bearer ${authToken.value}` },
          ...options.headers
        }
      });
      data = await response.json();
    } catch (error) {
      if (error.name === "AbortError" || ((_a = error.message) == null ? void 0 : _a.includes("cancelled"))) {
        return null;
      }
      if (authToken.value && (((_b = error.message) == null ? void 0 : _b.includes("CORS")) || ((_c = error.message) == null ? void 0 : _c.includes("fetch")) || error.name === "TypeError")) {
        authToken.value = null;
        refreshToken.value = null;
        userCookie.value = null;
        orgCookie.value = null;
        user.value = null;
        organization.value = null;
        setTimeout(async () => {
          await navigateTo("/login");
        }, 1e3);
        return;
      }
      throw error;
    }
    if (response.status === 403 && ((_d = data.error) == null ? void 0 : _d.code) === "PASSWORD_CHANGE_REQUIRED") {
      await navigateTo("/change-password");
      return;
    }
    if (response.status === 403) {
      (_e = data.error) == null ? void 0 : _e.code;
      (_f = data.error) == null ? void 0 : _f.message;
      return;
    }
    if (response.status === 401) {
      if (endpoint === "/login") {
        throw { data, status: response.status };
      }
      if (refreshToken.value && endpoint !== "/refresh") {
        try {
          await refreshAccessToken();
          return await apiRequest(endpoint, options);
        } catch (refreshError) {
        }
      }
      authToken.value = null;
      refreshToken.value = null;
      userCookie.value = null;
      orgCookie.value = null;
      user.value = null;
      organization.value = null;
      setTimeout(async () => {
        await navigateTo("/login");
      }, 1e3);
      return;
    }
    if (!data.success) {
      throw new Error(((_g = data.error) == null ? void 0 : _g.message) || "Request failed");
    }
    return data;
  };
  const hasPermission = (permission) => {
    var _a, _b, _c;
    return ((_b = (_a = user.value) == null ? void 0 : _a.permissions) == null ? void 0 : _b.includes(permission)) || ["owner", "admin"].includes((_c = user.value) == null ? void 0 : _c.role) || false;
  };
  const canAccessPartner = (partnerId) => {
    var _a, _b, _c;
    if (["owner", "admin"].includes((_a = user.value) == null ? void 0 : _a.role)) {
      return true;
    }
    return ((_c = (_b = user.value) == null ? void 0 : _b.accessible_partners) == null ? void 0 : _c.includes(partnerId)) || false;
  };
  const isAuthenticated = computed(() => !!authToken.value && !!user.value);
  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      if (response.success && response.data) {
        if (response.data.requires_password_change) {
          authToken.value = response.data.access_token;
          userCookie.value = { email: credentials.email };
          return response;
        }
        user.value = response.data.user;
        organization.value = response.data.organization;
        authToken.value = response.data.access_token;
        refreshToken.value = response.data.refresh_token;
        userCookie.value = response.data.user;
        orgCookie.value = response.data.organization;
      } else {
        throw new Error("Invalid login response");
      }
      return response;
    } finally {
      loading.value = false;
    }
  };
  const register = async (userData) => {
    loading.value = true;
    try {
      const response = await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify(userData)
      });
      if (response.success && response.data) {
        user.value = response.data.user;
        organization.value = response.data.organization;
        authToken.value = response.data.access_token;
        refreshToken.value = response.data.refresh_token;
        userCookie.value = response.data.user;
        orgCookie.value = response.data.organization;
      }
      return response;
    } finally {
      loading.value = false;
    }
  };
  const logout = async () => {
    try {
      await apiRequest("/logout", { method: "POST" });
    } catch (error) {
    }
    user.value = null;
    organization.value = null;
    authToken.value = null;
    refreshToken.value = null;
    userCookie.value = null;
    orgCookie.value = null;
  };
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error("No refresh token available");
    }
    try {
      const config = useRuntimeConfig();
      const response = await $fetch("/api/auth/refresh", {
        method: "POST",
        baseURL: config.public.apiBaseUrl,
        body: { refresh_token: refreshToken.value },
        headers: { "Content-Type": "application/json" }
      });
      if (response.success && response.data) {
        authToken.value = response.data.access_token;
        refreshToken.value = response.data.refresh_token;
        return response.data;
      }
    } catch (error) {
      authToken.value = null;
      refreshToken.value = null;
      userCookie.value = null;
      orgCookie.value = null;
      user.value = null;
      organization.value = null;
      await navigateTo("/login");
      throw error;
    }
  };
  const initializeAuth = () => {
    if (authToken.value && !user.value) {
      if (userCookie.value) {
        user.value = userCookie.value;
        organization.value = orgCookie.value;
      } else {
        authToken.value = null;
        refreshToken.value = null;
      }
    }
  };
  const changePassword = async (passwordData) => {
    return await apiRequest("/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData)
    });
  };
  const setInitialPassword = async (email, currentPassword, newPassword) => {
    return await apiRequest("/set-password", {
      method: "POST",
      body: JSON.stringify({
        email,
        current_password: currentPassword,
        new_password: newPassword
      })
    });
  };
  const inviteUser = async (userData) => {
    return await apiRequest("/invite-user", {
      method: "POST",
      body: JSON.stringify(userData)
    });
  };
  const resetPassword = async (email) => {
    return await apiRequest("/reset-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  };
  const getCurrentUser = async () => {
    if (!authToken.value) {
      return null;
    }
    try {
      const response = await apiRequest("/me");
      if (response.success && response.data) {
        user.value = response.data.user;
        organization.value = response.data.organization;
        userCookie.value = response.data.user;
        orgCookie.value = response.data.organization;
      }
      return response.data;
    } catch (error) {
      if (refreshToken.value) {
        try {
          await refreshAccessToken();
          const retryResponse = await apiRequest("/me");
          if (retryResponse.success && retryResponse.data) {
            user.value = retryResponse.data.user;
            organization.value = retryResponse.data.organization;
            userCookie.value = retryResponse.data.user;
            orgCookie.value = retryResponse.data.organization;
            return retryResponse.data;
          }
        } catch (refreshError) {
          await logout();
          await navigateTo("/login");
        }
      }
      return null;
    }
  };
  const validateSession = async () => {
    if (!authToken.value) {
      return false;
    }
    try {
      const config = useRuntimeConfig();
      const response = await $fetch("/api/auth/me", {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${authToken.value}`
        }
      });
      if (response.success && response.data) {
        user.value = response.data.user;
        organization.value = response.data.organization;
        userCookie.value = response.data.user;
        orgCookie.value = response.data.organization;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
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
    validateSession,
    inviteUser,
    hasPermission,
    canAccessPartner
  };
};

export { useAuth as u };
//# sourceMappingURL=useAuth-DSXahgcj.mjs.map
