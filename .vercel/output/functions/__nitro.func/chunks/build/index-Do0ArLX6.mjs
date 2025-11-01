import { L as __nuxt_component_2, e as __nuxt_component_1$1 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Accounting</h1><p class="text-gray-600 dark:text-gray-400">Manage bookings, partners, and financial records</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/accounting/bookings")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-calendar-days",
              class: "h-8 w-8 text-blue-600 dark:text-blue-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Bookings</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Manage booking payments and records</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-blue-100 dark:bg-blue-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-calendar-days",
                    class: "h-8 w-8 text-blue-600 dark:text-blue-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Bookings"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Manage booking payments and records")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/accounting/partners")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "h-8 w-8 text-green-600 dark:text-green-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Partners</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Partner management and invoicing</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-green-100 dark:bg-green-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-users",
                    class: "h-8 w-8 text-green-600 dark:text-green-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Partners"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Partner management and invoicing")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/expenses")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-minus-circle",
              class: "h-8 w-8 text-red-600 dark:text-red-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Expenses</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Track and manage expenses</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-red-100 dark:bg-red-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-minus-circle",
                    class: "h-8 w-8 text-red-600 dark:text-red-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Expenses"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Track and manage expenses")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/journal-entries")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-document-text",
              class: "h-8 w-8 text-purple-600 dark:text-purple-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Journal Entries</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Adjustments and corrections</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-purple-100 dark:bg-purple-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-document-text",
                    class: "h-8 w-8 text-purple-600 dark:text-purple-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Journal Entries"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Adjustments and corrections")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/dashboard")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chart-bar",
              class: "h-8 w-8 text-indigo-600 dark:text-indigo-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Dashboard</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Financial overview and analytics</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-chart-bar",
                    class: "h-8 w-8 text-indigo-600 dark:text-indigo-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Dashboard"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Financial overview and analytics")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/partners")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-building-office",
              class: "h-8 w-8 text-yellow-600 dark:text-yellow-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="ml-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Partner Management</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Add and manage partners</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-building-office",
                    class: "h-8 w-8 text-yellow-600 dark:text-yellow-400"
                  })
                ]),
                createVNode("div", { class: "ml-4" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Partner Management"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Add and manage partners")
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounting/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Do0ArLX6.mjs.map
