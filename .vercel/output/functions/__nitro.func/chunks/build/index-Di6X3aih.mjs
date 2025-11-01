import { L as __nuxt_component_2, e as __nuxt_component_1$1, f as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useDataManager } from './useDataManager-_ycBTlnZ.mjs';
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
import './api-BDnKztVE.mjs';
import './cookie-CGcYVFcE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { partners, units } = useDataManager();
    const totalUnits = computed(() => Array.isArray(units.value) ? units.value.length : 0);
    const totalPartners = computed(() => Array.isArray(partners.value) ? partners.value.length : 0);
    const metroBNBPartner = computed(() => {
      return Array.isArray(partners.value) ? partners.value.find((p) => p.name.toLowerCase().includes("metrobnb")) : null;
    });
    const ownUnits = computed(() => {
      if (!Array.isArray(units.value) || !metroBNBPartner.value) return 0;
      return units.value.filter((unit) => unit.partner_id === metroBNBPartner.value.id).length;
    });
    const partnerUnits = computed(() => {
      var _a;
      if (!Array.isArray(units.value) || !metroBNBPartner.value) return ((_a = units.value) == null ? void 0 : _a.length) || 0;
      return units.value.filter((unit) => unit.partner_id !== metroBNBPartner.value.id).length;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1><p class="text-gray-600 dark:text-gray-400">Business intelligence and performance insights</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/analytics/overview")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center p-6"${_scopeId}><div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-chart-bar",
              class: "h-8 w-8 text-blue-600 dark:text-blue-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Business Overview</h3><p class="text-sm text-gray-600 dark:text-gray-400 mb-4"${_scopeId}> Complete financial overview of your entire business including own units and partner units </p>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "blue",
              variant: "soft",
              block: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View Overview `);
                } else {
                  return [
                    createTextVNode(" View Overview ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "text-center p-6" }, [
                createVNode("div", { class: "w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-chart-bar",
                    class: "h-8 w-8 text-blue-600 dark:text-blue-400"
                  })
                ]),
                createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white mb-2" }, "Business Overview"),
                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, " Complete financial overview of your entire business including own units and partner units "),
                createVNode(_component_UButton, {
                  color: "blue",
                  variant: "soft",
                  block: ""
                }, {
                  default: withCtx(() => [
                    createTextVNode(" View Overview ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/analytics/own-units")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center p-6"${_scopeId}><div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-home-modern",
              class: "h-8 w-8 text-green-600 dark:text-green-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Own Units</h3><p class="text-sm text-gray-600 dark:text-gray-400 mb-4"${_scopeId}> Performance analytics for units directly owned and managed by MetroBNB </p>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "green",
              variant: "soft",
              block: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View Own Units `);
                } else {
                  return [
                    createTextVNode(" View Own Units ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "text-center p-6" }, [
                createVNode("div", { class: "w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-home-modern",
                    class: "h-8 w-8 text-green-600 dark:text-green-400"
                  })
                ]),
                createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white mb-2" }, "Own Units"),
                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, " Performance analytics for units directly owned and managed by MetroBNB "),
                createVNode(_component_UButton, {
                  color: "green",
                  variant: "soft",
                  block: ""
                }, {
                  default: withCtx(() => [
                    createTextVNode(" View Own Units ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, {
        class: "hover:shadow-lg transition-shadow cursor-pointer",
        onClick: ($event) => _ctx.$router.push("/analytics/partners")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center p-6"${_scopeId}><div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-users",
              class: "h-8 w-8 text-purple-600 dark:text-purple-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Partner Units</h3><p class="text-sm text-gray-600 dark:text-gray-400 mb-4"${_scopeId}> Analytics for partner-managed units with revenue sharing insights </p>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "purple",
              variant: "soft",
              block: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View Partners `);
                } else {
                  return [
                    createTextVNode(" View Partners ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "text-center p-6" }, [
                createVNode("div", { class: "w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-users",
                    class: "h-8 w-8 text-purple-600 dark:text-purple-400"
                  })
                ]),
                createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white mb-2" }, "Partner Units"),
                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mb-4" }, " Analytics for partner-managed units with revenue sharing insights "),
                createVNode(_component_UButton, {
                  color: "purple",
                  variant: "soft",
                  block: ""
                }, {
                  default: withCtx(() => [
                    createTextVNode(" View Partners ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold"${_scopeId}>Quick Stats</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold" }, "Quick Stats")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4"${_scopeId}><div class="text-center p-4"${_scopeId}><p class="text-2xl font-bold text-blue-600 dark:text-blue-400"${_scopeId}>${ssrInterpolate(unref(totalUnits))}</p><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Total Units</p></div><div class="text-center p-4"${_scopeId}><p class="text-2xl font-bold text-green-600 dark:text-green-400"${_scopeId}>${ssrInterpolate(unref(ownUnits))}</p><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Own Units</p></div><div class="text-center p-4"${_scopeId}><p class="text-2xl font-bold text-purple-600 dark:text-purple-400"${_scopeId}>${ssrInterpolate(unref(partnerUnits))}</p><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Partner Units</p></div><div class="text-center p-4"${_scopeId}><p class="text-2xl font-bold text-orange-600 dark:text-orange-400"${_scopeId}>${ssrInterpolate(unref(totalPartners))}</p><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Active Partners</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-2 md:grid-cols-4 gap-4" }, [
                createVNode("div", { class: "text-center p-4" }, [
                  createVNode("p", { class: "text-2xl font-bold text-blue-600 dark:text-blue-400" }, toDisplayString(unref(totalUnits)), 1),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Total Units")
                ]),
                createVNode("div", { class: "text-center p-4" }, [
                  createVNode("p", { class: "text-2xl font-bold text-green-600 dark:text-green-400" }, toDisplayString(unref(ownUnits)), 1),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Own Units")
                ]),
                createVNode("div", { class: "text-center p-4" }, [
                  createVNode("p", { class: "text-2xl font-bold text-purple-600 dark:text-purple-400" }, toDisplayString(unref(partnerUnits)), 1),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Partner Units")
                ]),
                createVNode("div", { class: "text-center p-4" }, [
                  createVNode("p", { class: "text-2xl font-bold text-orange-600 dark:text-orange-400" }, toDisplayString(unref(totalPartners)), 1),
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "Active Partners")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analytics/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Di6X3aih.mjs.map
