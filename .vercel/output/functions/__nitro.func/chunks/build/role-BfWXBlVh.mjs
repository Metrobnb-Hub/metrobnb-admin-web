import { a3 as defineNuxtRouteMiddleware, a4 as createError } from './server.mjs';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'pinia';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import 'vue/server-renderer';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './cookie-CGcYVFcE.mjs';

const role = defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();
  if (!user.value) return;
  const rolePermissions = {
    admin: ["*"],
    // Admin can access everything
    manager: [
      "/dashboard",
      "/analytics",
      "/accounting",
      "/expenses",
      "/accounting/invoices",
      "/journal-entries",
      "/partners",
      "/admin/units"
    ],
    staff: [
      "/dashboard",
      "/accounting/bookings",
      "/expenses",
      "/accounting/invoices",
      "/analytics/own-units"
    ],
    partner: [
      "/dashboard",
      "/accounting/bookings",
      "/expenses",
      "/accounting/invoices"
    ]
  };
  const userRole = user.value.role;
  const allowedPaths = rolePermissions[userRole] || [];
  if (userRole === "admin") return;
  const isAllowed = allowedPaths.some(
    (path) => to.path === path || to.path.startsWith(path + "/")
  );
  if (!isAllowed) {
    throw createError({
      statusCode: 403,
      statusMessage: `Access denied. ${userRole.toUpperCase()} role cannot access this page.`
    });
  }
});

export { role as default };
//# sourceMappingURL=role-BfWXBlVh.mjs.map
