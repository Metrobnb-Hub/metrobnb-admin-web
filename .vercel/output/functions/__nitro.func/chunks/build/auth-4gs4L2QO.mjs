import { B as executeAsync } from '../nitro/nitro.mjs';
import { a3 as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'vue';
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

const auth = defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  const { fetchUser, user } = useAuth();
  if (to.path === "/login" || to.path === "/register") {
    return;
  }
  if (!user.value) {
    [__temp, __restore] = executeAsync(() => fetchUser()), await __temp, __restore();
  }
  if (!user.value) {
    return navigateTo("/login?expired=1");
  }
});

export { auth as default };
//# sourceMappingURL=auth-4gs4L2QO.mjs.map
