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

const adminOnly = defineNuxtRouteMiddleware(() => {
  const { user } = useAuth();
  if (!user.value || user.value.role === "partner") {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied - Admin Only"
    });
  }
});

export { adminOnly as default };
//# sourceMappingURL=admin-only-CSbfCg38.mjs.map
