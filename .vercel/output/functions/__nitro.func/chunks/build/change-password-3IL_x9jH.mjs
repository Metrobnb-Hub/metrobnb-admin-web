import { b as useRouter, e as __nuxt_component_1$1, f as __nuxt_component_0$2 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, withModifiers, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useCookie } from './cookie-CGcYVFcE.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "change-password",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    useRouter();
    const form = ref({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    const error = ref("");
    const success = ref("");
    const loading = ref(false);
    const showPassword = ref(false);
    const userCookie = useCookie("user_data");
    computed(() => {
      var _a;
      return ((_a = userCookie.value) == null ? void 0 : _a.email) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_6;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-metrobnb-50 via-white to-metrobnb-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" }, _attrs))}><div class="min-h-screen flex items-center justify-center p-4"><div class="w-full max-w-md"><div class="text-center mb-8"><div class="w-16 h-16 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-2xl flex items-center justify-center mx-auto mb-4">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-key",
        class: "h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400"
      }, null, _parent));
      _push(`</div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2"> Password Change Required </h1><p class="text-gray-600 dark:text-gray-400"> Please change your temporary password to continue </p></div><div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8"><form class="space-y-5">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).currentPassword,
        "onUpdate:modelValue": ($event) => unref(form).currentPassword = $event,
        type: unref(showPassword) ? "text" : "password",
        placeholder: "Current temporary password",
        size: "lg",
        required: ""
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
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).newPassword,
        "onUpdate:modelValue": ($event) => unref(form).newPassword = $event,
        type: unref(showPassword) ? "text" : "password",
        placeholder: "New password",
        size: "lg",
        required: ""
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
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).confirmPassword,
        "onUpdate:modelValue": ($event) => unref(form).confirmPassword = $event,
        type: unref(showPassword) ? "text" : "password",
        placeholder: "Confirm new password",
        size: "lg",
        required: ""
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
            _push2(`${ssrInterpolate(unref(loading) ? "Changing Password..." : "Change Password")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(loading) ? "Changing Password..." : "Change Password"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/change-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=change-password-3IL_x9jH.mjs.map
