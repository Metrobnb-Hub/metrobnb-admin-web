import { L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
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
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1><p class="text-gray-600 dark:text-gray-400">Manage system settings and configurations</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Services</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Manage service offerings</p></div>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-cog-6-tooth",
              class: "h-8 w-8 text-blue-500"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/admin/services",
              block: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Manage Services`);
                } else {
                  return [
                    createTextVNode("Manage Services")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Services"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Manage service offerings")
                ]),
                createVNode(_component_UIcon, {
                  name: "i-heroicons-cog-6-tooth",
                  class: "h-8 w-8 text-blue-500"
                })
              ]),
              createVNode("div", { class: "mt-4" }, [
                createVNode(_component_UButton, {
                  to: "/admin/services",
                  block: ""
                }, {
                  default: withCtx(() => [
                    createTextVNode("Manage Services")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Booking Sources</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Configure booking channels</p></div>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-globe-alt",
              class: "h-8 w-8 text-green-500"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/admin/booking-sources",
              block: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Manage Sources`);
                } else {
                  return [
                    createTextVNode("Manage Sources")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Booking Sources"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Configure booking channels")
                ]),
                createVNode(_component_UIcon, {
                  name: "i-heroicons-globe-alt",
                  class: "h-8 w-8 text-green-500"
                })
              ]),
              createVNode("div", { class: "mt-4" }, [
                createVNode(_component_UButton, {
                  to: "/admin/booking-sources",
                  block: ""
                }, {
                  default: withCtx(() => [
                    createTextVNode("Manage Sources")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Users</h3><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Manage user accounts</p></div>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "h-8 w-8 text-purple-500"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/users",
              block: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Manage Users`);
                } else {
                  return [
                    createTextVNode("Manage Users")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("div", null, [
                  createVNode("h3", { class: "text-lg font-semibold" }, "Users"),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Manage user accounts")
                ]),
                createVNode(_component_UIcon, {
                  name: "i-heroicons-users",
                  class: "h-8 w-8 text-purple-500"
                })
              ]),
              createVNode("div", { class: "mt-4" }, [
                createVNode(_component_UButton, {
                  to: "/users",
                  block: ""
                }, {
                  default: withCtx(() => [
                    createTextVNode("Manage Users")
                  ]),
                  _: 1
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BItfEmbt.mjs.map
