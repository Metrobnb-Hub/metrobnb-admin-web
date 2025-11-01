import { e as __nuxt_component_1$1, f as __nuxt_component_0$2 } from './server.mjs';
import { _ as __nuxt_component_6 } from './Input-CkIGuQjB.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { u as useNotify } from './useNotify-7E9w0JIv.mjs';
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
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const { user, organization } = useAuth();
    useNotify();
    const updatingProfile = ref(false);
    const changingPassword = ref(false);
    const profileForm = ref({
      name: ((_a = user.value) == null ? void 0 : _a.name) || ""
    });
    const passwordForm = ref({
      current_password: "",
      new_password: "",
      confirm_password: ""
    });
    const passwordsMatch = computed(() => {
      return passwordForm.value.new_password === passwordForm.value.confirm_password;
    });
    const userEmail = computed(() => {
      var _a2;
      return ((_a2 = user.value) == null ? void 0 : _a2.email) || "";
    });
    const userRole = computed(() => {
      var _a2;
      return ((_a2 = user.value) == null ? void 0 : _a2.role) || "";
    });
    const organizationName = computed(() => {
      var _a2;
      return ((_a2 = organization.value) == null ? void 0 : _a2.name) || "";
    });
    watch(user, (newUser) => {
      if (newUser) {
        profileForm.value.name = newUser.name;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_6;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto p-6 space-y-6" }, _attrs))}><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><div class="flex items-center space-x-4"><div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-user",
        class: "h-8 w-8 text-blue-600 dark:text-blue-400"
      }, null, _parent));
      _push(`</div><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate((_a2 = unref(user)) == null ? void 0 : _a2.name)}</h1><p class="text-gray-600 dark:text-gray-400">${ssrInterpolate((_b = unref(user)) == null ? void 0 : _b.email)}</p><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize">${ssrInterpolate((_c = unref(user)) == null ? void 0 : _c.role)}</span></div></div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Information</h2><form class="space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(profileForm).name,
        "onUpdate:modelValue": ($event) => unref(profileForm).name = $event,
        type: "text",
        required: ""
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(userEmail),
        "onUpdate:modelValue": ($event) => isRef(userEmail) ? userEmail.value = $event : null,
        type: "email",
        disabled: "",
        class: "bg-gray-50"
      }, null, _parent));
      _push(`<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p></div></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(userRole),
        "onUpdate:modelValue": ($event) => isRef(userRole) ? userRole.value = $event : null,
        type: "text",
        disabled: "",
        class: "bg-gray-50 capitalize"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Organization</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(organizationName),
        "onUpdate:modelValue": ($event) => isRef(organizationName) ? organizationName.value = $event : null,
        type: "text",
        disabled: "",
        class: "bg-gray-50"
      }, null, _parent));
      _push(`</div></div>`);
      if ((_e = (_d = unref(user)) == null ? void 0 : _d.accessible_partners) == null ? void 0 : _e.length) {
        _push(`<div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Accessible Partners</label><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(unref(user).accessible_partners, (partnerId) => {
          _push(`<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"> Partner ${ssrInterpolate(partnerId.substring(0, 8))}... </span>`);
        });
        _push(`<!--]--></div><p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Contact admin to modify partner access</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-end">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        loading: unref(updatingProfile),
        color: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(updatingProfile) ? "Updating..." : "Update Profile")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(updatingProfile) ? "Updating..." : "Update Profile"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h2><form class="space-y-4"><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Password</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(passwordForm).current_password,
        "onUpdate:modelValue": ($event) => unref(passwordForm).current_password = $event,
        type: "password",
        required: ""
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(passwordForm).new_password,
        "onUpdate:modelValue": ($event) => unref(passwordForm).new_password = $event,
        type: "password",
        required: "",
        minlength: "8"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirm New Password</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(passwordForm).confirm_password,
        "onUpdate:modelValue": ($event) => unref(passwordForm).confirm_password = $event,
        type: "password",
        required: ""
      }, null, _parent));
      _push(`</div><div class="flex justify-end">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        disabled: unref(changingPassword) || !unref(passwordsMatch),
        loading: unref(changingPassword),
        color: "red"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(changingPassword) ? "Changing..." : "Change Password")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(changingPassword) ? "Changing..." : "Change Password"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Account Information</h2><div class="grid grid-cols-2 gap-4 text-sm"><div><span class="font-medium text-gray-500 dark:text-gray-400">User ID:</span><p class="font-mono text-gray-900 dark:text-gray-100">${ssrInterpolate((_f = unref(user)) == null ? void 0 : _f.id)}</p></div><div><span class="font-medium text-gray-500 dark:text-gray-400">Organization ID:</span><p class="font-mono text-gray-900 dark:text-gray-100">${ssrInterpolate((_g = unref(user)) == null ? void 0 : _g.organization_id)}</p></div><div><span class="font-medium text-gray-500 dark:text-gray-400">Permissions:</span><p class="text-gray-900 dark:text-gray-100">${ssrInterpolate(((_i = (_h = unref(user)) == null ? void 0 : _h.permissions) == null ? void 0 : _i.join(", ")) || "None")}</p></div><div><span class="font-medium text-gray-500 dark:text-gray-400">Plan:</span><p class="capitalize text-gray-900 dark:text-gray-100">${ssrInterpolate(((_j = unref(organization)) == null ? void 0 : _j.plan) || "Unknown")}</p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-Dap_Hosy.mjs.map
