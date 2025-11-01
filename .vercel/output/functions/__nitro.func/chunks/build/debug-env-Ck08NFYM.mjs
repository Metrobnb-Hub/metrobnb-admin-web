import { c as useRuntimeConfig, f as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "debug-env",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const nodeEnv = "production";
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8" }, _attrs))}><h1 class="text-2xl font-bold mb-4">Environment Debug</h1><div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow"><h2 class="text-lg font-semibold mb-4">Runtime Config</h2><div class="space-y-2"><div class="flex justify-between border-b pb-2"><span class="font-medium">API Base URL:</span><span class="font-mono text-blue-600">${ssrInterpolate(unref(config).public.apiBaseUrl)}</span></div><div class="flex justify-between border-b pb-2"><span class="font-medium">Dev Mode:</span><span class="font-mono">${ssrInterpolate(unref(config).public.devMode)}</span></div><div class="flex justify-between border-b pb-2"><span class="font-medium">Is Development:</span><span class="font-mono">${ssrInterpolate(unref(config).public.dev)}</span></div><div class="flex justify-between border-b pb-2"><span class="font-medium">NODE_ENV:</span><span class="font-mono">${ssrInterpolate(unref(nodeEnv))}</span></div></div><div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded"><h3 class="font-semibold mb-2">Test Credentials Available:</h3><div class="text-sm space-y-1"><div>Admin Email: ${ssrInterpolate(((_b = (_a = unref(config).public.testCredentials) == null ? void 0 : _a.admin) == null ? void 0 : _b.email) || "Not set")}</div><div>Staff Email: ${ssrInterpolate(((_d = (_c = unref(config).public.testCredentials) == null ? void 0 : _c.staff) == null ? void 0 : _d.email) || "Not set")}</div><div>Partner Email: ${ssrInterpolate(((_f = (_e = unref(config).public.testCredentials) == null ? void 0 : _e.partner) == null ? void 0 : _f.email) || "Not set")}</div></div></div><div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded"><h3 class="font-semibold mb-2">Which .env file is loaded?</h3><p class="text-sm">`);
      if (unref(config).public.apiBaseUrl === "http://localhost:8000") {
        _push(`<span class="text-green-600 font-bold"> \u2705 .env.local is loaded (localhost:8000) </span>`);
      } else if (unref(config).public.apiBaseUrl.includes("onrender.com")) {
        _push(`<span class="text-orange-600 font-bold"> \u26A0\uFE0F .env is loaded (production API) </span>`);
      } else {
        _push(`<span class="text-gray-600"> \u2753 Unknown configuration </span>`);
      }
      _push(`</p></div></div><div class="mt-4">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/",
        color: "gray"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Back to Home`);
          } else {
            return [
              createTextVNode("Back to Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/debug-env.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=debug-env-Ck08NFYM.mjs.map
