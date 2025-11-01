import { e as __nuxt_component_1$1, f as __nuxt_component_0$2, a as __nuxt_component_0$6 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { defineComponent, ref, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
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
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const email = ref("");
    const error = ref("");
    const success = ref("");
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_6;
      const _component_UButton = __nuxt_component_0$2;
      const _component_NuxtLink = __nuxt_component_0$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" }, _attrs))}><div class="min-h-screen flex items-center justify-center p-4"><div class="w-full max-w-md"><div class="text-center mb-8"><div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-envelope",
        class: "h-8 w-8 text-blue-600 dark:text-blue-400"
      }, null, _parent));
      _push(`</div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1><p class="text-gray-600 dark:text-gray-400"> Enter your email to receive password reset instructions </p></div><div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8"><form class="space-y-5">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(email),
        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
        type: "email",
        placeholder: "Your email address",
        size: "lg",
        required: ""
      }, null, _parent));
      if (unref(error)) {
        _push(`<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"><p class="text-red-600 dark:text-red-400 text-sm">${ssrInterpolate(unref(error))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(success)) {
        _push(`<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"><p class="text-green-600 dark:text-green-400 text-sm">${ssrInterpolate(unref(success))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        loading: unref(loading),
        color: "primary",
        size: "lg",
        block: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(loading) ? "Sending..." : "Send Reset Email")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(loading) ? "Sending..." : "Send Reset Email"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="mt-6 text-center"><p class="text-gray-600 dark:text-gray-400 text-sm"> Remember your password? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "font-semibold text-blue-600 hover:text-blue-500 ml-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign in `);
          } else {
            return [
              createTextVNode(" Sign in ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reset-password-Cb7S59FE.mjs.map
