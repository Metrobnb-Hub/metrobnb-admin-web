export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  
  if (!user.value) return
  
  const rolePermissions = {
    admin: ['*'], // Admin can access everything
    manager: [
      '/dashboard', '/analytics', '/accounting', '/expenses', '/invoices', 
      '/journal-entries', '/partners', '/admin/units'
    ],
    staff: [
      '/dashboard', '/accounting/bookings', '/expenses', '/invoices', 
      '/analytics/own-units'
    ],
    partner: [
      '/dashboard', '/accounting/bookings', '/expenses', '/invoices'
    ]
  }
  
  const userRole = user.value.role
  const allowedPaths = rolePermissions[userRole as keyof typeof rolePermissions] || []
  
  // Admin has access to everything
  if (userRole === 'admin') return
  
  // Check if current path is allowed for user role
  const isAllowed = allowedPaths.some(path => 
    to.path === path || to.path.startsWith(path + '/')
  )
  
  if (!isAllowed) {
    throw createError({
      statusCode: 403,
      statusMessage: `Access denied. ${userRole.toUpperCase()} role cannot access this page.`
    })
  }
})