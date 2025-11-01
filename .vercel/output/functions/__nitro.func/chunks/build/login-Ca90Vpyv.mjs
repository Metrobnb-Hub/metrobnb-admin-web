import { b as useRouter, c as useRuntimeConfig, d as useRoute, e as __nuxt_component_1$1, f as __nuxt_component_0$2, a as __nuxt_component_0$6 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, withModifiers, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
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
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './useFormGroup-B3564yef.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { loading } = useAuth();
    useRouter();
    const config = useRuntimeConfig();
    const credentials = ref({
      email: config.public.devMode ? config.public.testCredentials.admin.email : "",
      password: config.public.devMode ? config.public.testCredentials.admin.password : ""
    });
    const error = ref("");
    const showPassword = ref(false);
    useRoute();
    const showSessionExpired = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_6;
      const _component_UButton = __nuxt_component_0$2;
      const _component_NuxtLink = __nuxt_component_0$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" }, _attrs))}><div class="min-h-screen flex flex-col lg:flex-row"><div class="lg:w-1/2 bg-gradient-to-br from-metrobnb-600 to-metrobnb-700 relative overflow-hidden"><div class="lg:hidden p-6 text-center text-white"><div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-home-modern",
        class: "h-8 w-8"
      }, null, _parent));
      _push(`</div><h1 class="text-3xl font-bold mb-2">MetroBNB</h1><p class="text-white/80 mb-4">Property Management Made Simple</p><div class="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-flex items-center space-x-2"><div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span class="text-xs font-semibold">BETA TESTING</span></div></div><div class="hidden lg:flex lg:h-full lg:items-center lg:justify-center lg:p-12"><div class="absolute inset-0 bg-black/10"></div><div class="relative z-10 text-white max-w-md"><div class="mb-8"><div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-home-modern",
        class: "h-8 w-8"
      }, null, _parent));
      _push(`</div><h1 class="text-4xl font-bold mb-4">MetroBNB</h1><p class="text-xl text-white/80">Property Management Made Simple</p></div><div class="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2 mb-6"><div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span class="text-sm font-semibold">BETA TESTING</span></div><div class="space-y-4"><div class="flex items-center space-x-3"><div class="w-2 h-2 bg-white rounded-full"></div><span class="text-white/80">Manage multiple properties effortlessly</span></div><div class="flex items-center space-x-3"><div class="w-2 h-2 bg-white rounded-full"></div><span class="text-white/80">Track bookings and expenses in real-time</span></div><div class="flex items-center space-x-3"><div class="w-2 h-2 bg-white rounded-full"></div><span class="text-white/80">Generate invoices automatically</span></div></div></div></div></div><div class="flex-1 flex items-center justify-center p-4 lg:p-8"><div class="w-full max-w-md"><div class="hidden lg:block text-center mb-8"><h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2"> Welcome back </h2><p class="text-gray-600 dark:text-gray-400"> Sign in to your account to continue </p></div><div class="lg:hidden text-center mb-6"><h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1"> Welcome back </h2><p class="text-gray-600 dark:text-gray-400 text-sm"> Sign in to continue </p></div>`);
      if (unref(showSessionExpired)) {
        _push(`<div class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"><div class="flex items-start">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-exclamation-triangle",
          class: "h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0"
        }, null, _parent));
        _push(`<div class="flex-1"><h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-1"> Session Expired </h3><p class="text-sm text-red-700 dark:text-red-300"> Your session has expired. Please log in again to continue. </p></div><button class="text-red-400 hover:text-red-600 ml-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-x-mark",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8"><form class="space-y-5"><div class="space-y-4">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(credentials).email,
        "onUpdate:modelValue": ($event) => unref(credentials).email = $event,
        type: "email",
        placeholder: "Email address",
        size: "lg",
        autocomplete: "email",
        required: "",
        class: "w-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(credentials).password,
        "onUpdate:modelValue": ($event) => unref(credentials).password = $event,
        type: unref(showPassword) ? "text" : "password",
        placeholder: "Password",
        size: "lg",
        autocomplete: "current-password",
        required: "",
        class: "w-full"
      }, {
        trailing: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="text-gray-400 hover:text-gray-600 p-2 pointer-events-auto cursor-pointer z-10 relative"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: unref(showPassword) ? "i-heroicons-eye-slash" : "i-heroicons-eye",
              class: "h-5 w-5"
            }, null, _parent2, _scopeId));
            _push2(`</button>`);
          } else {
            return [
              createVNode("button", {
                type: "button",
                onClick: withModifiers(($event) => showPassword.value = !unref(showPassword), ["stop"]),
                class: "text-gray-400 hover:text-gray-600 p-2 pointer-events-auto cursor-pointer z-10 relative"
              }, [
                createVNode(_component_UIcon, {
                  name: unref(showPassword) ? "i-heroicons-eye-slash" : "i-heroicons-eye",
                  class: "h-5 w-5"
                }, null, 8, ["name"])
              ], 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"><p class="text-red-600 dark:text-red-400 text-sm">${ssrInterpolate(unref(error))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        loading: unref(loading),
        color: "primary",
        size: "lg",
        block: "",
        class: "font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(loading) ? "Signing in..." : "Sign in")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(loading) ? "Signing in..." : "Sign in"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
      if (unref(config).public.devMode) {
        _push(`<div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Test Credentials (Dev Mode):</p><div class="space-y-1 text-xs"><button class="block w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded"><strong>Admin:</strong> ${ssrInterpolate(unref(config).public.testCredentials.admin.email)} / ${ssrInterpolate(unref(config).public.testCredentials.admin.password)}</button><button class="block w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded"><strong>Staff:</strong> ${ssrInterpolate(unref(config).public.testCredentials.staff.email)} / ${ssrInterpolate(unref(config).public.testCredentials.staff.password)}</button><button class="block w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded"><strong>Partner:</strong> ${ssrInterpolate(unref(config).public.testCredentials.partner.email)} / ${ssrInterpolate(unref(config).public.testCredentials.partner.password)}</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-6 text-center space-y-3"><p class="text-gray-600 dark:text-gray-400 text-sm">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reset-password",
        class: "font-semibold text-metrobnb-600 hover:text-metrobnb-500"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Forgot your password? `);
          } else {
            return [
              createTextVNode(" Forgot your password? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><p class="text-gray-600 dark:text-gray-400 text-sm"> New to MetroBNB? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "font-semibold text-metrobnb-600 hover:text-metrobnb-500 ml-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create account `);
          } else {
            return [
              createTextVNode(" Create account ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-Ca90Vpyv.mjs.map
